import angular from 'angular';
import uiRouter from 'angular-ui-router';
import coreModule from '../core.module.es6';
let taskService = angular.module('core.app')
  .service('taskService', taskService);

//TODO: when all services checked for contact, folder, task and calendar then it should be disconnected from mailService

function taskService( $q, $http, $rootScope, logger, $log, vncConstant ){
  this.getTasks = function (options, callback) {
    let defaultOptions = {
      limit: 50,
      locale: {_content: 'en_US'},
      needExp: 1,
      offset: 0,
      query: 'in:tasks',
      sortBy: 'taskDueAsc',
      types: 'task'
    };

    let request = angular.extend({}, defaultOptions, options);
    return $http({
      url: $rootScope.API_URL + '/searchRequest',
      method: 'POST',
      data: request
    }).success(function (res) {
      if(res.task){
        if(!angular.isArray(res.task)){res.task = [res.task];}
        callback(res.task);
      }
      else {
        callback([]);
      }

    }).error(function (res) {
      if (typeof callback === 'function') {
        callback(res);
      }
    });
  };

  this.getTaskById = function (taskId, callback) {
    let request = {
      html: 1,
      id: taskId,
      max: 250000,
      needExp: 1
    };

    return $http({
      url: $rootScope.API_URL + '/getMsgRequest',
      method: 'POST',
      data: request
    }).success(function (res) {
      if (typeof callback === 'function') {
        if(res.m){
          callback(res.m);
        }
        else {
          callback([]);
        }
      }
    }).error(function (res) {
      if (typeof callback === 'function') {
        callback(res);
      }
    });
  };

  /** Create Task
   *
   * @param {object} options
   * @param {object} options.mp
   * @param {string} options.su
   * @param {object} options.inv
   * @param {number} options.l
   * @param {array}  options.e
   *
   */
  this.createTask = function (options, callback) {
    let defaultOptions = {
      e: [],
      mp: {},
      inv: {},
      su: '',
      l: 15,
      attach: {}
    };

    let request = angular.extend({}, defaultOptions, options);
    return $http({
      url: $rootScope.API_URL + '/createTask',
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

  /** Modify Task
   *
   * @param {object} options
   * @param {object} options.mp
   * @param {number} options.id
   * @param {string} options.su
   * @param {object} options.inv
   * @param {number} options.l
   * @param {array}  options.e
   *
   */
  this.modifyTask = function (options, callback) {
    let defaultOptions = {
      id: 0,
      e: [],
      mp: {},
      inv: {},
      su: '',
      l: 15,
      attach: {}
    };

    let request = angular.extend({}, defaultOptions, options);
    return $http({
      url: $rootScope.API_URL + '/modifyTask',
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

  /** Asign Tag Task
   *
   * @param {string} tagId
   * @param {string} tags
   *
   */
  this.assignTagToTask = function (tagId, tags, callback) {
    let request = {
      op: 'tag',
      tn: tags,
      id: tagId
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

  /** Move Task To Trash
   *
   * @param {string} tagId
   *
   */
  this.moveTaskToTrash = function (tagId, callback) {
    let request = {
      op: 'trash',
      id: tagId
    };

    return $http({
      url: $rootScope.API_URL + '/itemAction',
      method: 'POST',
      data: request
    }).success(function (res) {
      if (typeof callback === 'function') {
        callback(res);
      }
    }).error(function (res, err) {
      if (typeof callback === 'function') {
        callback(null, err);
      }
    });
  };

  /** Move Appointment To Folder
   *
   * @param {number} apptId
   * @param {number} folderId
   *
   */
  this.moveTaskToFolder = function (apptId, folderId, callback) {
    let request = {
      op: 'move',
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

  /** Delete Task
   *
   * @param {string} tagId
   *
   */
  this.deleteTask = function (options, callback) {
    let request = {
      op: options.op,
      l: options.folderId,
      id: options.id
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

  this.newTaskList = taskService.newTaskList;

  /**
   * Share TaskList
   *
   * @param {object} options
   * @param {string} options.id - List ID
   * @param {object} options.emailInfo - Email to receive the notification (e: Email address,
   * t: Optional Address type - (f)rom, (t)o, (c)c, (b)cc,
   * (r)eply-to, (s)ender, read-receipt (n)otification, (rf) resent-from
   * p: The comment/name part of an address
   * @param {string} options.notes - Notes
   */
  this.shareTaskList = function (options, callback) {
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

  /**
   * Move Task List to Trask
   * @param {string} listId - List ID
   */
  this.moveTaskListToTrash = function (listId, callback) {
    let request = {
      id: listId,
      op: 'trash'
    };
    if (angular.isDefined(request.id)) {
      return $http({
        url: $rootScope.API_URL + '/folderAction',
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
      logger.error('id and name are required');
    }
  };


  function processAppointmentAlarm(alarm) {
    let result = {};

    if (angular.isDefined(alarm) && angular.isDefined(alarm.trigger)) {
      result = {
        neg: alarm.trigger.rel.$.neg,
        related: alarm.trigger.rel.$.related
      };

      if (angular.isDefined(alarm.trigger.rel.$.w)) {
        result.number = alarm.trigger.rel.$.w;
        result.unit = result.number > 1 ? 'weeks' : 'week';
      }

      if (angular.isDefined(alarm.trigger.rel.$.d)) {
        result.number = alarm.trigger.rel.$.d;
        result.unit = result.number > 1 ? 'days' : 'day';
      }

      if (angular.isDefined(alarm.trigger.rel.$.h)) {
        result.number = alarm.trigger.rel.$.h;
        result.unit = result.number > 1 ? 'hours' : 'hour';
      }

      if (angular.isDefined(alarm.trigger.rel.$.m)) {
        result.number = alarm.trigger.rel.$.m;
        result.unit = result.number > 1 ? 'minutes' : 'minute';
      }

      if (angular.isDefined(alarm.trigger.rel.$.s)) {
        result.number = alarm.trigger.rel.$.s;
        result.unit = result.number > 1 ? 'seconds' : 'second';
      }
    }

    return result;
  }

  function processAppointmentRecur(recur) {
    let result = {};

    if (angular.isDefined(recur)) {
      result = {
        freq: recur.add.rule.$.freq,
        interval: recur.add.rule.interval.$.ival
      };

      // TODO: add these element if needed
      //if () {
      //  bysecond, byminute, byhour, byday, bymonthday, byyearday, byweekmo, bymonth, bysetpos, wkst
      //}
    }

    return result;
  }
}
