/*jshint -W104 */
/*jshint -W119 */
/*jshint -W101 */
/*jshint -W089 */
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import coreModule from './core.module';

//TODO: when all services checked for contact, folder, task and calendar then it should be disconnected from mail

let mailService = angular.module('core.app')
.service('mailService', mail);

/* @ngInject */
function mail($q, $http, $rootScope, logger, $log, vncConstant, contactService, taskService, folderService, calendarService, oldCalenderService){


    /**
     * The service to send an email
     *
     * @param {file} file - Attachment
     */
    this.upload = function (file, callback) {
        var fd = new FormData();
        fd.append('file', file);
        $http.post($rootScope.API_URL + '/upload', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(res){
            if (typeof callback === 'function') {
                callback(res.replace('200,\'null\',', ''), null);
            }
        })
        .error(function(res){
            if (typeof callback === 'function') {
                callback(null, res);
            }
        });
    };

        /**
     * This method is used to Save Draft Email
     * @param   {object}   data       -
     * @param   {string}   data.subject       - Mail subject
     * @param   {string}   data.contenttype   - Type of content
     * @param   {string}   data.content       - Email body
     * @param   {string}   data.aid           - Upload id
     * @param   {array}    data.emailInfo     - Email address information
     * @param   {array}    data.attach        - Multipart of mail attachment
     */
    this.saveDraft = function (data, callback) {
        return $http({
            url: $rootScope.API_URL + '/saveDraft',
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

    this.getAppointmentList = oldCalenderService.getAppointmentList;

    this.getAppointmentsFromTrash = oldCalenderService.getAppointmentsFromTrash;

    function getBodyFromMultiPart(mp) {
        var body = {};
        if (angular.isArray(mp)) {
            for (var i in mp) {
                if (angular.isDefined(mp[i].content)) {
                    body.content = mp[i].content;
                    body.type = mp[i].$.ct;
                    return body;
                }
            }
        }
        return null;

    }

    function getCdFromMultiPart(mp, attachments) {
        if (!angular.isDefined(attachments)) {
            attachments = [];
        }
        if (mp.cd) {
            attachments.push(mp);
        }
        for (var i in mp.mp) {
            attachments = getCdFromMultiPart(mp.mp[i], attachments);
        }
        return attachments;
    }

    function getCiFromMultiPart(mp, attachments) {
        if (!angular.isDefined(attachments)) {
            attachments = [];
        }
        if (mp.ci) {
            attachments.push(mp);
        }
        for (var i in mp.mp) {
            attachments = getCiFromMultiPart(mp.mp[i], attachments);
        }
        return attachments;
    }

    /**
     * This method will return list of email for given search criteria
     * @param    {string}    sortBy - Possible values: none|dateAsc|dateDesc|subjAsc|subjDesc|nameAsc|nameDesc|rcptAsc|rcptDesc|attachAsc|attachDesc|flagAsc|flagDesc| priorityAsc|priorityDesc
     * @param    {string}    offset - return result with given offset default 0
     * @param    {string}    limit  - return number of results specified as a limit default 100
     * @param    {string}    recip  - 0|1|2|false|true - Setting specifying which recipients should be returned.
     * @param    {string}    fullConversation - 0|1| Set to 1 (true) to include all messages in the conversation, even if they don't match the search, including items in Trash and Junk folders.
     * @param    {string}    needExp - 0|1 If 'needExp' is set in the request, two additional flags may be included in <e> elements for messages returned inline.
     * @param    {array}     query   -  message|conversation|appointment default message
     */
    this.getEmailList = function (data, callback) {
        return $http({
            url: $rootScope.API_URL + '/searchRequest',
            method: 'POST',
            data: data
        }).success(function (res) {
            if (typeof callback === 'function') {
                if(angular.isDefined(res.c)){
                    angular.isArray(res.c) || (res.c = [res.c]);
                    callback(res.c);
                }
                else {
                    callback([]);
                }

            }

        }).error(function (res) {
          console.log('error...', res);
            if (typeof callback === 'function') {
                callback(res);
            }
        });

    };

    /**
     * Get email detail by message id
     *
     * @param {number} id - Message ID
     */
    this.getEmailDetailByMessageId = function(data, callback) {
        return $http({
            url: $rootScope.API_URL + '/getMsgRequest',
            method: 'POST',
            data: data
        }).success(function (res) {
            if (typeof callback === 'function') {
                var emailDetailResponse = [];
                if (angular.isDefined(res.m)) {
                    callback(res.m);
                }
                else {
                    callback({});
                }
            }

        }).error(function (res) {
            if (typeof callback === 'function') {
                callback(res);
            }
        });
    };

    /**
     * This method will return list of email for given search criteria
     * @param    {string}    sortBy - Possible values: none|dateAsc|dateDesc|subjAsc|subjDesc|nameAsc|nameDesc|rcptAsc|rcptDesc|attachAsc|attachDesc|flagAsc|flagDesc| priorityAsc|priorityDesc
     * @param    {string}    offset - return result with given offset default 0
     * @param    {string}    limit  - return number of results specified as a limit default 100return number of results specified as a limit default 100
     * @param    {string}    recip  - 0|1|2|false|true - Setting specifying which recipients should be returned.
     * @param    {string}    fullConversation - 0|1| Set to 1 (true) to include all messages in the conversation, even if they don't match the search, including items in Trash and Junk folders.
     * @param    {string}    needExp - 0|1 If 'needExp' is set in the request, two additional flags may be included in <e> elements for messages returned inline.
     * @param    {array}     query   -  message|conversation|appointment default message
     * @param    {string}    types   - array of user search criteria
     */

    this.getEmailDetail = function (data, callback) {
        return $http({
            url: $rootScope.API_URL + '/searchConvRequest',
            method: 'POST',
            data: data
        }).success(function (res) {
            if (typeof callback === 'function') {
                if (!angular.isArray(res.m)) {
                    res.m = [res.m];
                }
                $rootScope.messageCid = res.m[0].$.cid;
                callback(res.m);
            }

        }).error(function (res) {
            if (typeof callback === 'function') {
                callback(res);
            }
        });
    };

    /**
     * The service to call autocomplete request from Zimbra
     *
     * @param {string} name   - Name
     * @param {string} type   - Type of addresses to auto-complete on
     *                           "account" for regular user accounts, aliases and distribution lists
     *                           "resource" for calendar resources
     *                           "group" for groups
     *                           "all" for combination of all types
     */
    this.autocomplete = function (data, callback) {
        return $http({
            url: $rootScope.API_URL + '/autocomplete',
            method: 'POST',
            data: data
        }).success(function (res) {
            if (typeof callback === 'function') {
                var results = [];
                for (var i in res) {
                    results.push(res[i].$);
                }
                callback(results);
            }

        }).error(function (res) {
            if (typeof callback === 'function') {
                callback(res);
            }
        });
    };

    this.getFolderList = folderService.getFolderList;

    /**
     * The service to send an email
     *
     * @param {array} emailInfo -
     * @param {string} subject   -
     * @param {string} content  -
     */
    this.sendEmail = function (data, callback) {

        return $http({
            url: $rootScope.API_URL + '/sendEmail',
            method: 'POST',
            data: data
        }).success(function (res) {
            if (typeof callback === 'function') {
                if (angular.isDefined(res.m)) {
                    callback(res.m.$.id);
                }
                else {
                    callback(null);
                }
            }

        }).error(function (res) {
            if (typeof callback === 'function') {
                callback(null, res);
            }
        });
    };


    this.filterContact = contactService.filterContact;

    this.filterTagContact = contactService.filterTagContact;

    this.filterTrashContact = contactService.filterTrashContact;

    this.filterEmailedContact = contactService.filterEmailedContact;

    this.getContacts = contactService.getContacts;

    this.getEmailedContacts = contactService.getEmailedContacts;

    this.getTrashContacts = contactService.getTrashContacts;

    this.searchContacts = contactService.searchContacts;

    this.getAccountDistributionLists = function (options, callback) {
        let defaultOptions = {
            ownerOf: 1,
            attrs: 'zimbraDistributionListUnsubscriptionPolicy,zimbraDistributionListSubscriptionPolicy,zimbraHideInGal'
        };

        let request = angular.extend({}, defaultOptions, options);
        return $http({
            url: $rootScope.API_URL + '/getAccountDistributionLists',
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
    };

    this.getDistributionList = function (options, callback) {
        let defaultOptions = {
            needOwners: 1,
            needRights: 'sendToDistList',
            dl: {
                name: 'vnc.team@vnc.biz' // please use your data
            }

        };

        let request = angular.extend({}, defaultOptions, options);
        return $http({
            url: $rootScope.API_URL + '/getDistributionList',
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
    };

    this.getPrintConversation = function (conversationId) {
          var url = $rootScope.API_URL + '/printMessage?id='+conversationId;
          return url;
    };

    this.getDistributionListMembers = function (options, callback) {
        let defaultOptions = {
            limit: 100,
            offset: 0,
            dl: 'vnc.team@vnc.biz' // please use your data
        };

        let request = angular.extend({}, defaultOptions, options);
        return $http({
            url: $rootScope.API_URL + '/getDistributionListMembers',
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
    };


     /**
     * Delete Single Message
     * @param {string} emailId   - Email ID
     */
    this.deleteMessage = function (emailId, callback) {
        var action = 'delete';
        return $http({
            url: $rootScope.API_URL + '/messageAction',
            method: 'POST',
            data: { id: emailId, op: action}
        }).success(function (res) {
            if (typeof callback === 'function') {
                callback(res.action);
            }

        }).error(function (res) {
            if (typeof callback === 'function') {
                callback(res);
            }
        });
    };

    /**
     * Move email to inbox, trash
     * @param {string} emailId   - Email ID
     * @param {string} folderId  - Folder ID
     */
    this.moveMessage = function (emailId, folderId, callback) {
        var action = 'move';
        return $http({
            url: $rootScope.API_URL + '/messageAction',
            method: 'POST',
            data: { id: emailId, op: action, l: folderId}
        }).success(function (res) {
            if (typeof callback === 'function') {
                callback(res.action);
            }

        }).error(function (res) {
            if (typeof callback === 'function') {
                callback(res);
            }
        });

    };

  /**
   * Move email to inbox, trash
   * @param {string} emailId   - Email ID
   * @param {string} folderId  - Folder ID
   */
  this.moveEmail = function (emailId, folderId, callback) {
    var action = 'move';
    return $http({
      url: $rootScope.API_URL + '/convAction',
      method: 'POST',
      data: { id: emailId, op: action, l: folderId}
    }).success(function (res) {
      if (typeof callback === 'function') {
        callback(res.action);
      }

    }).error(function (res) {
      if (typeof callback === 'function') {
        callback(res);
      }
    });

  };


    /**
     * Archive Email
     * @param {string} emailId   - Email ID
     * @param {string} archivedFolderId   - archivedFolderId
     */
    this.archiveEmail = function (emailId, archivedFolderId, callback) {
        var action = 'move';
        return $http({
            url: $rootScope.API_URL + '/setMailboxMetadata',
            method: 'POST',
            data: { archivedFolderId: archivedFolderId}
        }).success(function (res) {
            $http({
              url: $rootScope.API_URL + '/convAction',
              method: 'POST',
              data: { id: emailId, op: action}
            }).success(function (res) {
                if (typeof callback === 'function') {
                    callback(res.action);
                }

            }).error(function (res) {
                if (typeof callback === 'function') {
                    callback(res);
                }
            });

        }).error(function (res) {
            if (typeof callback === 'function') {
                callback(res);
            }
        });
    };

       /**
     * This method will return list of email for given search criteria
     * @param    {string}    sortBy - Possible values: none|dateAsc|dateDesc|subjAsc|subjDesc|nameAsc|nameDesc|
     rcptAsc|rcptDesc|attachAsc|attachDesc|flagAsc|flagDesc| priorityAsc|priorityDesc
     * @param    {string}    offset - return result with given offset default 0
     * @param    {string}    limit  - return number of results specified as a limit
     default 100return number of results specified as a limit default 100
     * @param    {string}    recip  - 0|1|2|false|true - Setting specifying which recipients should be returned.
     * @param    {string}    fullConversation - 0|1| Set to 1 (true) to include all messages in the conversation,
     even if they don't match the search, including items in Trash and Junk folders.
     * @param    {string}    needExp - 0|1 If 'needExp' is set in the request, two additional flags
     may be included in <e> elements for messages returned inline.
     * @param    {array}     query   -  message|conversation|appointment default message
     * @param    {string}    types   - array of user search criteria
     */
    this.searchRequest = function (data, callback) {
        if (angular.isUndefined(data.types)) {
          data.types = 'message';
        }

        return $http({
            url: $rootScope.API_URL + '/searchRequest',
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

    /**
     * getTotalUnreadInboxEmail
     */
    this.getTotalUnreadInboxEmail = function(callback) {
      var totalUnreadEmail = 0;
      let request = {
        types: 'message',
        needExp: 1,
        offset: 0,
        query: vncConstant.SEARCH_CRITERIA.IN_INBOX + ' ' +vncConstant.SEARCH_CRITERIA.IS_UNREAD,
        recip: '0',
        sortBy: 'dateDesc',
        limit: 100,
        fullConversation: 0
      };

      this.searchRequest(request, function (response) {
        if (response && angular.isDefined(response.m)) {
          if (angular.isArray(response.m)) {
            totalUnreadEmail = response.m.length > 99 ? '99+' : response.m.length;
          } else {
            totalUnreadEmail = 1;
          }
        } else {
          totalUnreadEmail = 0;
        }
        callback(totalUnreadEmail);
      });
    };

    /**
     * getTotalUnreadSentEmail
     */
    this.getTotalUnreadSentEmail = function(callback) {
      var totalUnreadEmail = 0;
      let request = {
        types: 'message',
        needExp: 1,
        offset: 0,
        query: vncConstant.SEARCH_CRITERIA.IN_SENT + ' ' + vncConstant.SEARCH_CRITERIA.IS_UNREAD,
        recip: '0',
        sortBy: 'dateDesc',
        limit: 100,
        fullConversation: 0
      };

      this.searchRequest(request, function (response) {
        if (response && angular.isDefined(response.m)) {
          if (angular.isArray(response.m)) {
            totalUnreadEmail = response.m.length > 99 ? '99+' : response.m.length;
          } else {
            totalUnreadEmail = 1;
          }
        } else {
          totalUnreadEmail = 0;
        }
        callback(totalUnreadEmail);
      });
    };

    /**
     * getTotalDraftsEmail
     */
    this.getTotalDraftsEmail = function(callback) {
      var totalUnreadEmail = 0;
      let request = {
        types: 'message',
        needExp: 1,
        offset: 0,
        query: vncConstant.SEARCH_CRITERIA.IN_DRAFTS,
        recip: '2',
        sortBy: 'readDesc',
        limit: 1000,
        fullConversation: 0
      };

      this.searchRequest(request, function (response) {
        if (response && angular.isDefined(response.m)) {
          if (angular.isArray(response.m)) {
            totalUnreadEmail = response.m.length > 99 ? '99+' : response.m.length;
          } else {
            totalUnreadEmail = 1;
          }
        } else {
          totalUnreadEmail = 0;
        }
        callback(totalUnreadEmail);
      });
    };

  /**
     * getTotalUnreadDraftsEmail
     */
    this.getTotalUnreadDraftsEmail = function(callback) {
      var totalUnreadEmail = 0;
      let request = {
        types: 'message',
        needExp: 1,
        offset: 0,
        query: vncConstant.SEARCH_CRITERIA.IN_DRAFTS + ' ' + vncConstant.SEARCH_CRITERIA.IS_UNREAD,
        recip: '0',
        sortBy: 'dateDesc',
        limit: 100,
        fullConversation: 0
      };

      this.searchRequest(request, function (response) {
        if (response && angular.isDefined(response.m)) {
          if (angular.isArray(response.m)) {
            totalUnreadEmail = response.m.length > 99 ? '99+' : response.m.length;
          } else {
            totalUnreadEmail = 1;
          }
        } else {
          totalUnreadEmail = 0;
        }
        callback(totalUnreadEmail);
      });
    };

    /**
     * getTotalUnreadJunkEmail
     */
    this.getTotalUnreadJunkEmail = function(callback) {
      var totalUnreadEmail = 0;
      let request = {
        types: 'message',
        needExp: 1,
        offset: 0,
        query: vncConstant.SEARCH_CRITERIA.IN_JUNK + ' ' + vncConstant.SEARCH_CRITERIA.IS_UNREAD,
        recip: '0',
        sortBy: 'dateDesc',
        limit: 100,
        fullConversation: 0
      };

      this.searchRequest(request, function (response) {
        if (response && angular.isDefined(response.m)) {
          if (angular.isArray(response.m)) {
            totalUnreadEmail = response.m.length > 99 ? '99+' : response.m.length;
          } else {
            totalUnreadEmail = 1;
          }
        } else {
          totalUnreadEmail = 0;
        }
        callback(totalUnreadEmail);
      });
    };

    /**
     * getTotalUnreadTrashEmail
     */
    this.getTotalUnreadTrashEmail = function(callback) {
      var totalUnreadEmail = 0;
      let request = {
        types: 'message',
        needExp: 1,
        offset: 0,
        query: vncConstant.SEARCH_CRITERIA.IN_TRASH + ' ' + vncConstant.SEARCH_CRITERIA.IS_UNREAD,
        recip: '0',
        sortBy: 'dateDesc',
        limit: 100,
        fullConversation: 0
      };

      this.searchRequest(request, function (response) {
        if (response && angular.isDefined(response.m)) {
          if (angular.isArray(response.m)) {
            totalUnreadEmail = response.m.length > 99 ? '99+' : response.m.length;
          } else {
            totalUnreadEmail = 1;
          }
        } else {
          totalUnreadEmail = 0;
        }
        callback(totalUnreadEmail);
      });
    };

    /**
     * Make Email read and unread.
     * @param {string} emailId   - Email ID
     * @param {string} action    - Operation (delete|read|flag|tag|move|update|spam|trash)
     */
    this.messageActions = function (emailId, action, callback) {
        return $http({
            url: $rootScope.API_URL + '/messageAction',
            method: 'POST',
            data: { id: emailId, op: action}
        }).success(function (res) {
          console.log('success', res)
            if (typeof callback === 'function') {
                callback(res.action);
            }

        }).error(function (res) {
            if (typeof callback === 'function') {
                callback(res);
            }
        });

    };

    /**
     * The service to do actions for mail
     * @param {string} emailId   - Email ID
     * @param {string} action        - Operation (delete|read|flag|tag|move|update|spam|trash)
     */
    this.mailActions = function (emailId, action, callback) {
      return $http({
        url: $rootScope.API_URL + '/convAction',
        method: 'POST',
        data: { id: emailId, op: action}
      }).success(function (res) {
        if (typeof callback === 'function') {
          callback(res.action);
        }


      }).error(function (res) {
        if (typeof callback === 'function') {
          callback(res);
        }
      });

    };

    this.moveContact = contactService.moveContact;

    this.deleteContactFromTrash = contactService.deleteContactFromTrash

    this.createMailFolder = folderService.createMailFolder;

    this.createContactFolder = contactService.createContactFolder

    /**
     * Create new tag
     * @param {object} options
     * @param {string} options.name
     * @param {number} options.color - color numeric; range 0-127;
     */
    this.createTag = function (options, callback) {
        let defaultOptions = {
            color: 1
        };
        let request = angular.extend({}, defaultOptions, options);
        if (angular.isDefined(request.name) && angular.isDefined(request.color)) {
            return $http({
                url: $rootScope.API_URL + '/createTag',
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

    this.createContact = contactService.createContact;

    this.modifyContact = contactService.modifyContact;

    this.deleteContact = contactService.deleteContact;

    this.deleteFolder = folderService.deleteFolder;

    this.editFolderProperties = folderService.editFolderProperties;

    this.makeFolderAction = folderService.makeFolderAction;

    this.shareFolder = folderService.shareFolder;

    this.shareFolderBatchRequest = folderService.shareFolderBatchRequest;

    this.getFolderBatchRequest = folderService.getFolderBatchRequest;

    this.getShareInfoBatchRequest = folderService.getShareInfoBatchRequest;

    this.sendShareFolderRequest = folderService.sendShareFolderRequest;

    this.deleteFolderFromTrash = folderService.deleteFolderFromTrash;

    this.emptyTrash = folderService.emptyTrash;

    /** Delete Tag
     *
     * @param {number} tagId
     *
     */
    this.deleteTag = function (tagId, callback) {
        let request = {
            id: tagId,
            op: 'delete'
        };
        if (angular.isDefined(tagId)) {
            return $http({
                url: $rootScope.API_URL + '/tagAction',
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
            logger.error('tagId is required');
        }
    };

    this.moveContact = contactService.moveContact;

    this.assignTagToContact = contactService.assignTagToContact;

    this.removeTagInContact = contactService.removeTagInContact;

    this.removeAllTagInContact = contactService.removeAllTagInContact;

    this.getItem = folderService.getItem;

     /**
     * The service to upload avatar then save the avatar with {aid: "", n: "image"}
     *
     * @param {file} file - Attachment
     */
    this.uploadAvatar = function (file, callback) {
        var fd = new FormData();
        fd.append('file', file);
        $http.post($rootScope.API_URL + '/uploadAvatar', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(res){
            if (typeof callback === 'function') {
                callback(res.replace('200,\'null\',', ''));
            }
        })
        .error(function(res){
            if (typeof callback === 'function') {
                callback(res);
            }
        });
    };

  /** Make all operation in a Folder
     *
     * @param {number} requests
     *
     */
    this.makeFolderActions = function (folders, callback) {
        let batchRequest = {
            FolderActionRequest: []
        };

        let i = 0;
        for (let [key, value] of folders) {
          batchRequest.FolderActionRequest.push({
                '@': {
                    'xmlns': 'urn:zimbraMail'
                },
                'action': {
                    'id': key,
                    'op': value ? 'check' : '!check'
                }
            });

          ++i;
        }

        $http({
              url: $rootScope.API_URL + '/batchRequest',
              method: 'POST',
              data: batchRequest
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
     * The service to call autocomplete request from Zimbra
     *
     * @param {string} name   - Name
     * @param {string} type   - Type of addresses to auto-complete on
     *                           "account" for regular user accounts, aliases and distribution lists
     *                           "resource" for calendar resources
     *                           "group" for groups
     *                           "all" for combination of all types
     */
    this.noOp = function (data, callback) {
        return $http({
            url: $rootScope.API_URL + '/noOp',
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

    this.getTasks = taskService.getTasks;

    this.getTaskById = taskService.getTaskById;

    function getKeyValue(data) {
      return {key: data.$.n, value: data._};
    }

    this.getMailboxMetadata = function (callback) {
          let request = {
                  GetMailboxMetadataRequest:
                  {
                      '@': {
                        'xmlns': 'urn:zimbraMail',
                        'requestId': '0'
                      },
                      'meta': {
                        '@': {
                            'section': 'zwc:implicit'
                        }
                    }
                  }
              };


          return $http({
              url: $rootScope.API_URL + '/batchRequest',
              method: 'POST',
              data: request
          }).success(function (res) {
            if (typeof callback === 'function') {
                callback(_.map(res.getmailboxmetadataresponse.meta.a, getKeyValue));
            }
          }).error(function (res) {
              if (typeof callback === 'function') {
                callback(res);
              }
          });
    };

    this.getDataSources = function (callback) {
          let request = {
                  GetDataSourcesRequest:
                  {
                      '@': {
                        'xmlns': 'urn:zimbraMail',
                        'requestId': '0'
                      }
                  }
              };

          return $http({
              url: $rootScope.API_URL + '/batchRequest',
              method: 'POST',
              data: request
          }).success(function (res) {
            if (typeof callback === 'function' && angular.isDefined(res.getdatasourcesresponse) ) {
                callback(res.getdatasourcesresponse);
            }
          }).error(function (res) {
              if (typeof callback === 'function') {
                callback(res);
              }
          });
    };

    this.createTask = taskService.createTask;

    this.modifyTask = taskService.modifyTask;

    this.assignTagToTask = taskService.assignTagToTask;

    this.moveTaskToTrash = taskService.moveTaskToTrash;

    this.moveTaskToFolder = taskService.moveTaskToFolder;

    this.recoverDeletedAppointments = oldCalenderService.recoverDeletedAppointments;

    this.tagAppointment = oldCalenderService.tagAppointment;

    this.removeTagFromAppointment = oldCalenderService.removeTagFromAppointment;

    this.removeAllTagFromAppointment = oldCalenderService.removeAllTagFromAppointment;

    this.deleteTask = taskService.deleteTask;

    this.newTaskList = taskService.newTaskList;

    this.shareTaskList = taskService.shareTaskList;

    this.moveTaskListToTrash = taskService.moveTaskListToTrash;

    this.getAppointmentDetail = oldCalenderService.getAppointmentDetail;

    this.cancelAppointment = oldCalenderService.cancelAppointment;

    this.cancelOwnAppointment = oldCalenderService.cancelOwnAppointment;

    this.cancelOneInstanceAppointment = oldCalenderService.cancelOneInstanceAppointment;

    this.declineAppointment = oldCalenderService.declineAppointment;

    this.deleteSeries = oldCalenderService.deleteSeries;

    this.deleteInstance = oldCalenderService.deleteInstance;

    this.deleteAppointment = oldCalenderService.deleteAppointment;

    this.acceptAppointment = oldCalenderService.acceptAppointment;

    this.createAppointment = oldCalenderService.createAppointment;

    this.tentativeAppointment = oldCalenderService.tentativeAppointment;

    this.sendInviteReply = oldCalenderService.sendInviteReply;

    this.getWorkingHours = oldCalenderService.getWorkingHours;

    this.modifyAppointment = oldCalenderService.modifyAppointment;

    this.getCalendarTreeView = oldCalenderService.getCalendarTreeView;

    this.createCalendarFolder = oldCalenderService.createCalendarFolder;

    this.renameFolder = folderService.renameFolder;

    /**
     * Rename Tag
     * @param {object} options
     * @param {string} options.id - Tag ID
     * @param {string} options.name - Tag name
     */
    this.renameTag = function (options, callback) {
        let defaultOptions = {
            op: 'rename'
        };
        let request = angular.extend({}, defaultOptions, options);
        if (angular.isDefined(request.id) && angular.isDefined(request.name)) {
            return $http({
                url: $rootScope.API_URL + '/tagAction',
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

    this.changeFolderColor = folderService.changeFolderColor;

    /**
     * Change Tag Color
     * @param {object} options
     * @param {string} options.id - Tag ID
     * @param {string} options.color - Tag color
     */
    this.changeTagColor = function (options, callback) {
        let defaultOptions = {
            op: 'color'
        };
        let request = angular.extend({}, defaultOptions, options);
        if (angular.isDefined(request.id) && (angular.isDefined(request.color) || angular.isDefined(request.rgb))) {
            return $http({
                url: $rootScope.API_URL + '/tagAction',
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
            callback(null, {msg: 'id and color are required'});
            logger.error('id and color are required');
        }
    };

    this.excludeFreeBusyFolder = folderService.excludeFreeBusyFolder;

    this.moveFolder = folderService.moveFolder;

    /**
     * Mark message as Read
     * @param {number} emailId - Email ID
     */
    this.messageMarkAsRead = function (emailId, callback) {
        let request = {
            id: emailId,
            op: 'read'
        };
        if (angular.isDefined(emailId)) {
            return $http({
                url: $rootScope.API_URL + '/messageAction',
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
            logger.error('emailId is required');
        }
    };

    /**
     * Mark message as Unread
     * @param {number} emailId - Email ID
     */
    this.messageMarkAsUnread = function (emailId, callback) {
        let request = {
            id: emailId,
            op: '!read'
        };
        if (angular.isDefined(emailId)) {
            return $http({
                url: $rootScope.API_URL + '/messageAction',
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
            logger.error('emailId is required');
        }
    };

    /**
     * Mark conversation as Read
     * @param {number} emailId - Email ID
     */
    this.conversationMarkAsRead = function (emailId, callback) {
      let request = {
        id: emailId,
        op: 'read'
      };
      if (angular.isDefined(emailId)) {
        return $http({
          url: $rootScope.API_URL + '/convAction',
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
        logger.error('emailId is required');
      }
    };

    /**
     * Mark conversation as Unread
     * @param {number} emailId - Email ID
     */
    this.conversationMarkAsUnread = function (emailId, callback) {
    let request = {
      id: emailId,
      op: '!read'
    };
    if (angular.isDefined(emailId)) {
      return $http({
        url: $rootScope.API_URL + '/convAction',
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
      logger.error('emailId is required');
    }
  };

    /**
     * Flag Email
     * @param {number} emailId - Email ID
     */
    this.flagEmail = function (emailId, callback) {
        let request = {
            id: emailId,
            op: 'flag'
        };
        if (angular.isDefined(emailId)) {
            return $http({
                url: $rootScope.API_URL + '/convAction',
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
            logger.error('emailId is required');
        }
    };

    /**
     * Unflag Email
     * @param {number} emailId - Email ID
     */
    this.unflagEmail = function (emailId, callback) {
        let request = {
            id: emailId,
            op: '!flag'
        };
        if (angular.isDefined(emailId)) {
            return $http({
                url: $rootScope.API_URL + '/convAction',
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
            logger.error('emailId is required');
        }
    };


  /**
   * Mark as Spam
   * @param {number} messageId - Message ID
   */
  this.markMessageAsSpam = function (messageId, callback) {
    let request = {
      op: 'spam',
      id: messageId
    };
    if (angular.isDefined(messageId)) {
      return $http({
        url: $rootScope.API_URL + '/messageAction',
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
      logger.error('messageId is required');
    }
  };

  /**
   * Undo Email from Spam
   * @param {number} messageId - Message ID
   * @param {number} folderId - Folder ID
   */
  this.unSpamMessage = function (messageId, callback) {
    let request = {
      op: '!spam',
      id: messageId
    };
    if (angular.isDefined(messageId)) {
      return $http({
        url: $rootScope.API_URL + '/messageAction',
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
      logger.error('emailId is required');
    }
  };

    /**
     * Mark as Spam
     * @param {number} emailId - Email ID
     */
    this.markConversationAsSpam = function (emailId, callback) {
        let request = {
            op: 'spam',
            id: emailId
        };
        if (angular.isDefined(emailId)) {
            return $http({
                url: $rootScope.API_URL + '/convAction',
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
            logger.error('emailId is required');
        }
    };

    /**
     * Undo Email from Spam
     * @param {number} emailId - Email ID
     * @param {number} folderId - Folder ID
     */
    this.unSpamConversation = function (emailId, callback) {
        let request = {
            op: '!spam',
            id: emailId
        };
        if (angular.isDefined(emailId)) {
            return $http({
                url: $rootScope.API_URL + '/convAction',
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
            logger.error('emailId is required');
        }
    };

    /**
     * Check Spelling
     * @param {number} word - Word
     */
    this.checkSpelling = function (word, callback) {
        let request = {
            word: word
        };
        return $http({
            url: $rootScope.API_URL + '/checkSpelling',
            method: 'POST',
            data: request
        }).success(function (res) {
            if (typeof callback === 'function') {
              if (res.misspelled) {
                callback(res.misspelled.$);
              }
              else {
                callback(null);
              }

            }

        }).error(function (res) {
            if (typeof callback === 'function') {
                callback(null);
            }
        });
    };

    /**
     * Get Spell Dictionaries
     */
    this.getSpellDictionaries = function (emailId, callback) {
        return $http({
            url: $rootScope.API_URL + '/getSpellDictionaries',
            method: 'GET',
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
    };

    /**
     * Move Email to Trash
     * @param {number} emailId - Email ID
     */
    this.moveEmailToTrash = function (emailId, callback) {
        let request = {
            op: 'trash',
            l: 3,
            id: emailId,
            tcon: '-dtjs'
        };
        if (angular.isDefined(emailId)) {
            return $http({
                url: $rootScope.API_URL + '/convAction',
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
            logger.error('emailId is required');
        }
    };

    /**
     * Undo Email from Trash
     * @param {number} emailId - Email ID
     * @param {number} folderId - Folder ID
     */
    this.undoEmailFromTrash = function (emailId, folderId, callback) {
      let request = {
        op: 'move',
        l: folderId,
        id: emailId
      };
      if (angular.isDefined(emailId)) {
        return $http({
          url: $rootScope.API_URL + '/convAction',
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
        logger.error('emailId is required');
      }
    };

    /**
     * Delete Email
     * @param {number} emailId - Email ID
     */
    this.deleteEmail = function (emailId, callback) {
      let request = {
        op: 'delete',
        id: emailId
      };
      if (angular.isDefined(emailId)) {
        return $http({
          url: $rootScope.API_URL + '/convAction',
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
        logger.error('emailId is required');
      }
  };

    /**
     * Delete Email From Trash
     * @param {number} emailId - Email ID
     */
    this.deleteEmailFromTrash = function (emailId, callback) {
        let request = {
            op: 'delete',
            id: emailId,
            tcon: 't'
        };
        if (angular.isDefined(emailId)) {
            return $http({
                url: $rootScope.API_URL + '/convAction',
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
            logger.error('emailId is required');
        }
    };

    this.shareCalendar = oldCalenderService.shareCalendar;

    function setPreference(preference) {
      return {
              '@': {
                  'name': preference.key
              },
              '#': preference.value
            };
    }

    function getPref(data) {
      return {key: data.$.name, value: data._};
    }

    /**
     * Save Preferences
     *
     * @param {string} prefName - prefName
     */
    this.getPreferences = function (prefName, callback) {
        $http({
            url: $rootScope.API_URL + '/getPrefs',
            method: 'POST',
            data: {prefName: prefName}
        }).success(function (res) {
          if (typeof callback === 'function') {
            if (res.pref) {
              callback(_.map(res.pref, getPref));
            }
            else {
              callback(null);
            }
          }
        }).error(function (res) {
            if (typeof callback === 'function') {
              callback(res);
            }
        });
  };

  /**
     * Save Preferences
     *
     * @param {array} preferences - A list of preferences with key and value [{'key': 'zimbraPref', 'value': 'new value'}]
     */
    this.savePreferences = function (preferences, callback) {
      if (preferences.length > 0) {
          let pref = _.map(preferences, setPreference);
          let request = {
                  ModifyPrefsRequest:
                  {
                      '@': {
                        'xmlns': 'urn:zimbraAccount',
                        'requestId': '0'
                      },
                      'pref': pref
                  }
              };

          $http({
              url: $rootScope.API_URL + '/batchRequest',
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
      }
  };

  /**
   * Get Signatures
   *
   */
  this.getSignatures = function (callback) {
    let request = {
            GetSignaturesRequest:
            {
                '@': {
                  'xmlns': 'urn:zimbraAccount',
                  'requestId': '0'
                }
            }
        };

    $http({
        url: $rootScope.API_URL + '/batchRequest',
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

  /** Assign Tag to Conversation
   *
   * @param {number} conversationId
   * @param {string} tags
   *
   */
  this.assignTagToConversation = function (mailId, tags, callback) {
    if (angular.isDefined(mailId) && angular.isDefined(tags)) {
      let request = {
        op: 'tag',
        tn: tags,
        id: mailId
      };
      return $http({
        url: $rootScope.API_URL + '/convAction',
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
      logger.error('mailId and tags are required');
    }
  };

  this.removeTagFromConversation = function (mailId, tags, callback) {
    if (angular.isDefined(mailId) && angular.isDefined(tags)) {
      let request = {
        op: '!tag',
        tn: tags,
        id: mailId
      };
      return $http({
        url: $rootScope.API_URL + '/convAction',
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
      logger.error('mailId and tags are required');
    }
  };

  /** Remove All Tag In Conversation
   *
   * @param {number} conversatonId
   *
   */
  this.removeAllTagInConversation = function (conversationId, callback) {
    if (angular.isDefined(conversationId)) {
      let request = {
        op: 'update',
        tn: '',
        id: conversationId
      };
      return $http({
        url: $rootScope.API_URL + '/convAction',
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
      logger.error('ConversationId and tags are required');
    }
  };

  /** Bound Request
   *
   * @param {object} request
   * @param {number} request.id - Id of msg to resend
   * @param {array} request.e - list of email info
   *
   * let request = {
        'id':'14478',
        'e': [
          {
            't':'t',
            'a':'macanh.huy@vnc.biz'
          },
         {
            't':'t',
            'a':'jaydeep@zuxfdev.vnc.biz'
         }
        ]
      };
   */
  this.bounceMsg = function (request, callback) {
      return $http({
        url: $rootScope.API_URL + '/bounceMsg',
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
  };

  /** Print Task
   *
   * @param {number} taskids - Ids of task to print
   *
   */
  this.printTask = function (taskIds, callback) {
    var url = $rootScope.API_URL + '/printTask?id='+taskIds;
    return url;
  };

  /** Print Contact
   *
   * @param {number} contactId
   *
   */
  this.printContact = function (contactId, callback) {
    if (angular.isDefined(contactId)) {
      var url = $rootScope.API_URL + '/printContact?id='+contactId;
      return url;
    } else {
      logger.error('contactId is required');
    }
  };
}
