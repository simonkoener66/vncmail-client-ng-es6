/* jshint ignore:start */
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import coreModule from '../core.module.es6';
let calendarService = angular.module('core.app')
  .service('oldCalenderService', oldCalenderService);

//TODO: when all services checked for contact, folder, task and calendar then it should be disconnected from mailService

function oldCalenderService( $q, $http, $rootScope, logger, $log, vncConstant ){

  /** Get Calendar Tree view
   *
   * */
  this.getCalendarTreeView = function(callback) {
    let data = {
      view: 'appointment'
    };

    return $http({
      url: $rootScope.API_URL + '/getFolderList',
      method: 'POST',
      data: data
    }).success(function (res) {
      if (typeof callback === 'function') {
        if (res.folder){
          callback(res.folder);
        }
      }
    }).error(function (res) {
      if (typeof callback === 'function') {
        callback(res);
      }
    });
  };

  /**
   * Create new calendar
   * @param {object} options
   * @param {string} options.name - Folder name
   * @param {string} options.folderId - Folder Id (If "folderId" is unset, name is the full path of the new folder)
   * @param {number} options.color - color numeric; range 0-127;
   * @param {number} options.f - Set b# If you want to exclude this calendar when reporting free/busy times
   */
  this.createCalendarFolder = function (options, callback) {
    let defaultOptions = {
      view: 'appointment',
      color: 1
    };
    let request = angular.extend({}, defaultOptions, options);
    if (angular.isDefined(request.name) && angular.isDefined(request.name)) {
      return $http({
        url: $rootScope.API_URL + '/createFolder',
        method: 'POST',
        data: request
      }).success(function (res) {
        if (typeof callback === 'function') {
          callback(res);
        }

      }).error(function (res) {
        if (typeof callback === 'function') {
          callback(null, res);
        }
      });
    } else {
      logger.error('name is required');
    }
  };

  /**
   * Share Calendar
   *
   * @param {object} options
   * @param {string} options.id - Item ID
   * @param {object} options.emailInfo - Email to receive the notification (e: Email address,
   * t: Optional Address type - (f)rom, (t)o, (c)c, (b)cc, (r)eply-to, (s)ender, read-receipt (n)otification, (rf) resent-from
   * p: The comment/name part of an address
   * @param {string} options.notes - Notes
   */
  this.shareCalendar = function (options, callback) {
    let defaultOptions = {
      notes: ''
    };
    let request = angular.extend({}, defaultOptions, options);
    if (angular.isDefined(request.id) && angular.isDefined(request.emailInfo)) {
      return $http({
        url: $rootScope.API_URL + '/sendShareNotification',
        method: 'POST',
        data: request
      }).success(function (res) {
        if (typeof callback === 'function') {
          callback(res);
        }

      }).error(function (res) {
        if (typeof callback === 'function') {
          callback(null, res);
        }
      });
    } else {
      logger.error('id and emailInfo are required');
    }
  };

  function processAppointmentData(appt, apptData, instance) {
    var startTime = angular.isArray(appt.inst) ? appt.inst[0].$.s : appt.inst.$.s;

    let at = [{
      a: appt.or.$.a,
      d: appt.or.$.d, // display name
      ptst: appt.$.ptst, // status from this person AC = accept? NE = never?
      role: 'REQ',
      rsvp: '1',
      url: appt.or.$.url,
    }];

    return {
      'id': apptData.id,
      'apptId': apptData.id,
      'invid': apptData.invId,
      'name': apptData.name, // appt subject or title
      'location': apptData.loc,
      'l': apptData.l,
      'fragment': appt.fr,
      'starttime': parseInt(startTime),
      'endtime': parseInt(startTime) + parseInt(apptData.dur),
      'alarm': apptData.alarm,
      'allDay': apptData.allDay,
      'class': apptData.class,
      'status': apptData.status,
      'recur': angular.isDefined(apptData.recur) ? true : false,
      'inst': angular.isDefined(appt.inst) ? appt.inst : [],
      'isOrg': apptData.isOrg,
      'at': at,
      'dur': angular.isDefined(apptData.dur) ? apptData.dur : 0,
      't': apptData.t,
      'tn': apptData.tn,
      'thisInstance': angular.isDefined(instance) ? instance.$.ridZ : '', // This is used for deleted this instance only
      'uid': appt.uid || apptData.uid,
      'xuid': appt.x_uid || apptData.x_uid,
      'l': appt.l || apptData.l,
      'compNum': appt.compNum || apptData.compNum,
      'class': appt.class || apptData.class,
      'rev': appt.rev || apptData.rev, // revision for cancellation
      'ms': appt.ms || apptData.ms, // modified sequence for cancellation
      'otherAtt': angular.isDefined(appt.$.otherAtt) ? Number(appt.$.otherAtt) : 0
    };
  }

  /**
   * The service is used to get the appointment list from Zimbra API
   *
   * @param {number} offset - Specifies the 0-based offset into the results list to
   return as the first result for this search operation.
   * @param {number} limit - The maximum number of results to return. It defaults to 10
   if not specified, and is capped by 1000
   * @param {string} calExpandInstStart - start time in miliseconds
   * @param {string} calExpandInstEnd - end time in miliseconds
   */
  this.getAppointmentList = function (data, callback) {
    data.types = 'appointment';
    if (!angular.isDefined(data.query)) {
      data.query = 'inid: 10';
    }

    return $http({
      url: $rootScope.API_URL + '/searchRequest',
      method: 'POST',
      data: data
    }).success(function (res) {
      if (typeof callback === 'function') {
        var appointmentList = [];
        var appt = null;
        var apptData = null;

        if (angular.isDefined(res.appt)) {
          // We will work only on apptListFromResponse array
          let apptListFromResponse = [];
          if (angular.isArray(res.appt)) {
            apptListFromResponse = res.appt;
          } else {
            // If res.appt is not an array, push it into apptListFromResponse array
            apptListFromResponse.push(res.appt);
          }

          // Loop through all elements of apptListFromResponse array
          for (let apptFromResponse of apptListFromResponse) {
            appt = apptFromResponse;
            // If there are more than one instance of the current appt
            if (angular.isArray(appt.inst)) {
              // Loop through the instances
              for (let instance of appt.inst) {
                // Check if the start and end date time is between the request start and end date time
                if (data.calExpandInstStart <= instance.$.s &&
                  (Number(instance.$.s) + Number(appt.$.dur)) <= data.calExpandInstEnd) {
                  // Clone the current appt with start and end date time of current instance
                  appt = angular.copy(apptFromResponse);
                  appt.inst = instance;
                  // Push it into appointmentList
                  apptData = angular.isDefined(appt.$) ? appt.$ : appt;
                  appointmentList.push(processAppointmentData(appt, apptData, instance));
                }
              }
            } else {
              // If there is only one instance, push it into appointmentList
              apptData = angular.isDefined(appt.$) ? appt.$ : appt;
              appointmentList.push(processAppointmentData(appt, apptData, undefined));
            }
          }
        }
        callback(appointmentList);
      }

    }).error(function (res) {
      if (typeof callback === 'function') {
        callback(res);
      }
    });
  };

  /**
   * Get appointments from trash
   *
   * @param {object} options
   * @param {number} options.offset -
   * @param {number} options.limit - The maximum number of results to return.
   * @param {string} options.tz - Timezone
   * @param {string} options.locale - Locale
   */
  this.getAppointmentsFromTrash = function (options, callback) {
    let defaultOptions = {
      needExp: 1,
      offset: 0,
      limit: 20,
      query: 'inid:3',
      types: 'appointment',
    };
    let request = angular.extend({}, defaultOptions, options);
    return $http({
      url: $rootScope.API_URL + '/searchRequest',
      method: 'POST',
      data: request
    }).success(function (res) {
      if (typeof callback === 'function') {
        var appointmentList = [];
        var appt = null;
        var apptData = null;

        if (angular.isDefined(res.appt)) {
          if (angular.isArray(res.appt)) {
            for (var i in res.appt) {
              appt = res.appt[i];
              apptData = angular.isDefined(appt.$) ? appt.$ : appt;
              appointmentList.push(processAppointmentData(appt, apptData, undefined));
            }
          } else {
            appt = res.appt;
            apptData = angular.isDefined(appt.$) ? appt.$ : appt;
            appointmentList.push(processAppointmentData(appt, apptData, undefined));
          }
        }
        callback(appointmentList);
      }

    }).error(function (res) {
      if (typeof callback === 'function') {
        callback(res);
      }
    });
  };

  /** Recover Deleted Appointments to Calendar
   *
   * @param {number} apptIds: separate by comma
   * @param {number} folderId
   *
   */
  this.recoverDeletedAppointments = function (apptId, folderId, callback) {
    let request = {
      op: 'recover',
      l: folderId,
      id: apptId
    };

    return $http({
      url: $rootScope.API_URL + '/itemAction',
      method: 'POST',
      data: request
    }).success(function (res) {
      if (typeof callback === 'function') {
        callback(res);
      }
    }).error(function (res) {
      if (typeof callback === 'function') {
        callback(res);
      }
    });
  };

  /** Tag Appointment
   *
   * @param {number} apptId
   * @param {string} tags - Tag
   *
   */
  this.tagAppointment = function (apptId, tags, callback) {
    let request = {
      op: 'tag',
      tn: tags,
      id: apptId
    };

    return $http({
      url: $rootScope.API_URL + '/itemAction',
      method: 'POST',
      data: request
    }).success(function (res) {
      if (typeof callback === 'function') {
        callback(res);
      }
    }).error(function (res) {
      if (typeof callback === 'function') {
        callback(res);
      }
    });
  };

  /** Remove Tag from Appointment
   *
   * @param {number} apptId
   * @param {string} tags - Tag
   *
   */
  this.removeTagFromAppointment = function (apptId, tags, callback) {
    let request = {
      op: '!tag',
      tn: tags,
      id: apptId
    };

    return $http({
      url: $rootScope.API_URL + '/itemAction',
      method: 'POST',
      data: request
    }).success(function (res) {
      if (typeof callback === 'function') {
        callback(res);
      }
    }).error(function (res) {
      if (typeof callback === 'function') {
        callback(res);
      }
    });
  };

  /** Remove All Tag from Appointment
   *
   * @param {number} apptId
   *
   */
  this.removeAllTagFromAppointment = function (apptId, callback) {
    let request = {
      op: 'update',
      t: '',
      id: apptId
    };

    return $http({
      url: $rootScope.API_URL + '/itemAction',
      method: 'POST',
      data: request
    }).success(function (res) {
      if (typeof callback === 'function') {
        callback(res);
      }
    }).error(function (res) {
      if (typeof callback === 'function') {
        callback(res);
      }
    });
  };

  /**
   * The service is used to get the appointment list from Zimbra API
   *
   * @param {number} id - Message ID
   */
  this.getAppointmentDetail = function (id, callback) {
    return $http({
      url: $rootScope.API_URL + '/getMsgRequest',
      method: 'POST',
      data: {id: id}
    }).success(function (res) {
      if (typeof callback === 'function') {
        var appointmentDetail = [];
        var attachments = [];

        if (angular.isDefined(res.m.mp)) {
          var mp = res.m.mp;

          if (angular.isDefined(mp.mp)) {
            var mineParts = mp.mp;
            for (var j in mineParts) {
              let minePart = mineParts[j];
              if (minePart.$.cd === 'attachment') {
                attachments.push(minePart.$);
              }
            }
          }
        }

        for (var i in res.m) {
          var appDetail = res.m[i];
          if (appDetail.comp) {
            let at = appDetail.comp.at;
            if (angular.isArray(at)) {
              at = at.map(function(value, index){return value.$;});
            }
            else {
              if (angular.isDefined(at)) {
                at = [at.$];
              }

            }
            appointmentDetail.push({
              'id': id,
              'attendee': appDetail.comp.at,
              'name': appDetail.comp.$.name,
              'location': appDetail.comp.$.loc,
              'body': appDetail.comp.desc,
              'description': appDetail.comp.desc,
              'calItemId': appDetail.comp.$.calItemId,
              'apptId': appDetail.comp.$.apptId,
              'status': appDetail.comp.$.status,
              'ciFolder': appDetail.comp.$.ciFolder,
              'class': appDetail.comp.$.class,
              's': appDetail.comp.s.$,
              'htmlDesc': appDetail.comp.deschtml,
              'organizer': appDetail.comp.or.$.a,
              'e': appDetail.comp.e.$,
              'at': at,
              'attachment': attachments,
              'apiUrl': vncConstant.API_URL,
              'alarm': processAppointmentAlarm(appDetail.comp.alarm), // alarm / reminder
              'recur': processAppointmentRecur(appDetail.comp.recur), // recur / repeat
              'fba': appDetail.comp.$.fba, // free-busy actual
              'allDay': appDetail.comp.$.allDay
            });
          }
        }
        callback(appointmentDetail);
      }

    }).error(function (res) {
      if (typeof callback === 'function') {
        callback(res);
      }
    });
  };

  /**
   * The service is used to cancel the appointment
   *
   * @param {number} id - Message ID
   * @param {number} emailInfo -  Email Info If Cancel with message
   * @param {number} instance -  One instance of a repeating appointment
   *
   * Sample of emailInfo:
   emailInfo = {
     // IF NOT SENDING CANCELLATION TO ATTENDEES --> e = []
        e: [{
          a: <<attendee's email>>,
          p: <<attendee's full name>>,
          t: 't'
        }],
        su: 'Cancelled: ' + <<appointment's title>>,
        mp: {
          // IF NOT SENDING CANCELLATION TO ATTENDEES --> mp[0].content = mp[1].content = ''
          mp: [
            {
              ct: 'text/plain',
              content: <<delete message>>
            },
            {
              ct: 'text/html',
              content: <<delete message>>
            }
          ],
          ct: 'multipart/alternative'
        }
      };

   * Sample of instance:
   instance = {
       d: '20160125T040000Z'
     };
   */
  this.cancelAppointment = function (id, emailInfo, instance, callback) {
    let data = {
      id: id
    };

    if (angular.isDefined(emailInfo)) {
      data.emailInfo = emailInfo;
    }

    // For cancel only one instance of a repeating appointment
    if (angular.isDefined(instance)) {
      data.inst = instance;
    }

    return $http({
      url: $rootScope.API_URL + '/cancelAppointment',
      method: 'POST',
      data: data
    }).success(function (res) {
      if (typeof callback === 'function') {
        callback(res);
      }

    }).error(function (res) {
      if (typeof callback === 'function') {
        callback(res);
      }
    });
  };

  this.cancelOwnAppointment = function (id, emailInfo, callback) {
    this.cancelAppointment(id, emailInfo, undefined, callback);
  };

  this.cancelOneInstanceAppointment = function (id, emailInfo, instance, callback) {
    this.cancelAppointment(id, emailInfo, instance, callback);
  };

  /**
   * The service is used to decline the appointment
   * @param {object} options
   * @param {number} options.id - Message ID
   * @param {number} options.updateOrganizer -  Update organizer
   */
  this.declineAppointment = function (options, callback) {
    let defaultOptions = {
      verb: 'DECLINE',
      compNum: 0
    };

    let request = angular.extend({}, defaultOptions, options);

    return $http({
      url: $rootScope.API_URL + '/sendInviteReply',
      method: 'POST',
      data: request
    }).success(function (res) {
      if (typeof callback === 'function') {
        callback(res);
      }

    }).error(function (res) {
      if (typeof callback === 'function') {
        callback(res);
      }
    });
  };

  /**
   * The service is used to delete the appointment instance
   * @param {object} options
   * @param {number} options.id - Message ID
   * @param {number} options.updateOrganizer -  Update organizer
   * @param {string} options.idnt - Identity ID to use to send reply
   * @param {object} options.inviteInfo -  Mail Info
   * @param {object} options.cancelInfo -  Cancel Info
   */
  this.deleteSeries = function (options, callback) {
    let defaultOptions = {
      verb: 'DECLINE',
      updateOrganizer: true,
      emailInfo: options.inviteInfo,
      compNum: 0
    };

    let defaultCancelOptions = {
      emailInfo: options.inviteInfo,
      compNum: 0
    };

    let cancelRequest = angular.extend({}, defaultCancelOptions, options);

    let sendCancel = $http({
      url: $rootScope.API_URL + '/cancelAppointment',
      method: 'POST',
      data: cancelRequest
    });

    $q.all([sendCancel])
      .then(function(res) {
        if (typeof callback === 'function') {
          callback(res);
        }
        callback(result);
      }).error(function (res) {
        if (typeof callback === 'function') {
          callback(res);
        }
      });
  };

  /**
   * The service is used to delete the appointment instance
   * @param {object} options
   * @param {number} options.id - Message ID
   * @param {number} options.updateOrganizer -  Update organizer
   * @param {string} options.idnt - Identity ID to use to send reply
   * @param {object} options.inviteInfo -  Mail Info
   * @param {object} options.cancelInfo -  Cancel Info
   */
  this.deleteInstance = function (options, callback) {
    let defaultOptions = {
      verb: 'DECLINE',
      updateOrganizer: true,
      emailInfo: options.inviteInfo,
      compNum: 0
    };

    let request = angular.extend({}, defaultOptions, options);

    let sendInvite = $http({
      url: $rootScope.API_URL + '/sendInviteReply',
      method: 'POST',
      data: request
    });

    let defaultCancelOptions = {
      emailInfo: options.inviteInfo,
      compNum: 0
    };

    let cancelRequest = angular.extend({}, defaultCancelOptions, options);

    let sendCancel = $http({
      url: $rootScope.API_URL + '/cancelAppointment',
      method: 'POST',
      data: cancelRequest
    });

    $q.all([sendInvite, sendCancel])
      .then(function(res) {
        if (typeof callback === 'function') {
          callback(res);
        }
        callback(result);
      }).error(function (res) {
        if (typeof callback === 'function') {
          callback(res);
        }
      });
  };

  /**
   * Delete appointment
   *
   * @param {number} apptId - Appointment Id
   */
  this.deleteAppointment = function (apptId, callback) {
    let defaultOptions = {
      op: 'delete',
      id: apptId
    };

    let request = angular.extend({}, defaultOptions, options);

    return $http({
      url: $rootScope.API_URL + '/itemAction',
      method: 'POST',
      data: request
    }).success(function (res) {
      if (typeof callback === 'function') {
        callback(res);
      }

    }).error(function (res) {
      if (typeof callback === 'function') {
        callback(res);
      }
    });
  };

  /**
   * The service is used to accept the appointment
   *
   * @param {object} options - Options
   * @param {number} options.id - Message ID
   */
  this.acceptAppointment = function (options, callback) {
    let defaultOptions = {
      verb: 'ACCEPT',
      compNum: 0
    };

    let request = angular.extend({}, defaultOptions, options);

    return $http({
      url: $rootScope.API_URL + '/sendInviteReply',
      method: 'POST',
      data: request
    }).success(function (res) {
      if (typeof callback === 'function') {
        callback(res);
      }

    }).error(function (res) {
      if (typeof callback === 'function') {
        callback(res);
      }
    });
  };

  /**
   * The service is used to create new appointment
   *
   * @param {object} options - Options
   */
  this.createAppointment = function (options, callback) {
    let defaultOptions = {
      folderId: 10
    };

    let request = angular.extend({}, defaultOptions, options);

    return $http({
      url: $rootScope.API_URL + '/createAppointment',
      method: 'POST',
      data: request
    }).success(function (res) {
      if (typeof callback === 'function') {
        callback(res);
      }

    }).error(function (res) {
      if (typeof callback === 'function') {
        callback(res);
      }
    });
  };

  /**
   * The service is used to tentative the appointment
   *
   * @param {object} options
   * @param {number} options.id - Message ID
   * @param {number} options.updateOrganizer -  Update organizer
   */
  this.tentativeAppointment = function (options, callback) {
    let defaultOptions = {
      verb: 'TENTATIVE',
      compNum: 0
    };

    let request = angular.extend({}, defaultOptions, options);

    return $http({
      url: $rootScope.API_URL + '/sendInviteReply',
      method: 'POST',
      data: request
    }).success(function (res) {
      if (typeof callback === 'function') {
        callback(res);
      }

    }).error(function (res) {
      if (typeof callback === 'function') {
        callback(res);
      }
    });
  };

  /**
   * The service to do the send invite reply from Zimbra API
   * @param {object} options
   * @param {string} options.id - Unique ID of the invite (and component therein) you are replying to
   * @param {string} options.idnt - Identity ID to use to send reply
   * @param {string} options.compNum - component number of the invite
   * @param {string} options.verb - Verb - ACCEPT, DECLINE, TENTATIVE
   * @param {string} options.updateOrganizer - Update organizer. Set by default. if unset then only make the update locally.
   This parameter has no effect if an <m> element is present.
   */
  this.sendInviteReply = function (options, callback) {
    let defaultOptions = {
      types: 'message'
    };

    let request = angular.extend({}, defaultOptions, options);
    return $http({
      url: $rootScope.API_URL + '/sendInviteReply',
      method: 'POST',
      data: request
    }).success(function (res) {
      if (typeof callback === 'function') {
        if(angular.isDefined(res.$)){
          callback(res.$);
        }
        else {
          callback(res);
        }
      }

    }).error(function (res) {
      if (typeof callback === 'function') {
        callback(res);
      }
    });

  };

  /**
   * Get Working Hours
   * @param {object} options
   * @param {number} options.startTime
   * @param {number} options.endTime
   * @param {string} options.name
   */
  this.getWorkingHours = function (options, callback) {
    if (angular.isDefined(options.name) &&
      angular.isDefined(options.startTime) &&
      angular.isDefined(options.endTime)) {
      return $http({
        url: $rootScope.API_URL + '/getWorkingHours',
        method: 'POST',
        data: options
      }).success(function (res) {
        if (typeof callback === 'function') {
          callback(res);
        }

      }).error(function (res) {
        if (typeof callback === 'function') {
          callback(null, res);
        }
      });
    } else {
      alert('startTime, endTime and name are required');
    }
  };

  /**
   * Modify Appointment
   * @param {object} options
   * @param {string} options.id   - Id
   * @param {string} options.subject   - Subject
   * @param {array}  options.emailInfo   - Email address information
   * @param {array}  options.inviteInfo   - Invite information
   * @param {object} options.mp   - Mime part information
   * @param {number} options.folderId   - Folder Id
   * @param {object} options.attach   - attachment
   */
  this.modifyAppointment = function (options, callback) {

    let defaultOptions = {
      folderId: 10
    };

    let request = angular.extend({}, defaultOptions, options);

    if (angular.isDefined(request.id) &&
      angular.isDefined(request.subject) &&
      angular.isDefined(request.emailInfo) &&
      angular.isDefined(request.inviteInfo) &&
      angular.isDefined(request.mp) ) {
      return $http({
        url: $rootScope.API_URL + '/modifyAppointment',
        method: 'POST',
        data: request
      }).success(function (res) {
        if (typeof callback === 'function') {
          callback(res);
        }

      }).error(function (res) {
        if (typeof callback === 'function') {
          callback(null, res);
        }
      });
    } else {
      alert('Please input all required params');
    }
  };

}
/* jshint ignore:end */
