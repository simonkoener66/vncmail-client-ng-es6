import angular from 'angular';
import uiRouter from 'angular-ui-router';
import coreModule from '../core.module.es6';
let folderService = angular.module('core.app')
  .service('folderService', folderService);

//TODO: when all services checked for contact, folder, task and calendar then it should be disconnected from mailService

function folderService( $q, $http, $rootScope, logger, $log, vncConstant ){

  /**
   * @param    {object}    folder  -  uuid (Base folder UUID), l (Base folder ID), path (Fully qualified path)
   * @param    {number}    depth   - If "depth" is set to a non-negative number, we include that many
   * levels of subfolders in the response.
   */
  this.getFolderList = function (data, callback) {
    return $http({
      url: $rootScope.API_URL + '/getFolderList',
      method: 'POST',
      data: data
    }).success(function (res) {
      if (typeof callback === 'function') {
        if (res.folder){
          generateDataForTreeView(res.folder.folder);
          callback(res.folder);
        }
      }

    }).error(function (res) {
      if (typeof callback === 'function') {
        callback(res);
      }
    });
    function generateDataForTreeView(folder) {
      for (var i in folder) {
        if (folder[i].folder) {
          if(!angular.isArray(folder[i].folder)){folder[i].folder = [folder[i].folder];}
          generateDataForTreeView(folder[i].folder);
        }
      }
    }
  };

  /**
   * Create a Mail folder
   * @param {object} options
   * @param {string} options.name - If "l" is unset, name is the full path of the new folder;
   * @param {number} options.color - color numeric; range 0-127;
   */
  this.createMailFolder = function (options, callback) {
    let defaultOptions = {
      view: 'message',
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

  /** Delete Folder
   *
   * @param {number} folderId
   *
   */
  this.deleteFolder = function (folderId, callback) {
    let request = {
      id: folderId,
      op: 'trash'
    };
    if (angular.isDefined(folderId)) {
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
      logger.error('folderId is required');
    }
  };

  /** edit Properties any option in a Folder
   *
   * @param {number} folderId
   * @param {options} object
   *
   */
  this.editFolderProperties = function (folderId, options, callback) {
    let defaultOptions = {
      id: folderId,
      op: 'update',
    };
    let request = angular.extend({}, defaultOptions, options);
    if (angular.isDefined(folderId && options)) {
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
      logger.error('folderId and options are required');
    }
  };

  /** Make all operation in a Folder
   *
   * @param {number} folderId
   * @param {option} string
   *
   */
  this.makeFolderAction = function (folderId, option, callback) {
    let request = {
      id: folderId,
      op: option,
      recursive: false
    };
    if (angular.isDefined(folderId && option)) {
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
      logger.error('folderId and option is required');
    }
  };

  /** Grant a folder share permission
   *
   * @param {number} folderId
   * @param {option} string
   *
   */
  this.shareFolder = function (options, callback) {
    let request = {
      id: options.id,
      op: options.op,
      gt: options.gt,
      d: options.d,
      zid: options.zid,
      perm: options.perm || ''
    };
    if (angular.isDefined(request.id && request.op)) {
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
      logger.error('folderId and option is required');
    }
  };

  /** Share Folder Batch Request
   *
   * @param {object} option
   *
   */
  this.shareFolderBatchRequest = function (options, callback) {
    let request = {
      FolderActionRequest:
      {
        '@': {
          'xmlns': 'urn:zimbraMail',
          'requestId': '0'
        },
        'action': {
          '@': {
            'op': options.op,
            'id': options.id
          },
          'grant': {
            '@': {
              'gt': options.gt,
              'inh': options.inh,
              'd': options.d,
              'perm': options.perm || '',
              'pw': options.pw || ''
            }
          }
        }
      },
      SendShareNotificationRequest:
      {
        '@': {
          'xmlns': 'urn:zimbraMail',
          'requestId': '0'
        },
        'item': {
          '@': {
            'id': options.id
          }
        },
        'e': {
          '@': {
            'a': options.d
          }
        },
        'notes': options.notes || ''
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

  /** Get Folder Batch Request
   *
   * @param {array} folderIds
   *
   */
  this.getFolderBatchRequest = function (folderIds, callback) {
    let uniquefolderIds = new Set(folderIds);
    let folderRequest = [];
    let i = 1;
    for (var folderId of uniquefolderIds) {
      folderRequest.push({
        '@': {
          'xmlns': 'urn:zimbraMail',
          'requestId': i
        },
        'folder': {
          'l': folderId
        }

      });
      i++;
    }
    let request = {
      GetFolderRequest: folderRequest
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

  /** Get Share Info Batch Request
   *
   * @param {array} listEmail
   *
   */
  this.getShareInfoBatchRequest = function (listEmail, callback) {
    let uniqueEmail = new Set(listEmail);
    let shareInfoRequest = [];
    let i = 1;
    for (var email of uniqueEmail) {
      shareInfoRequest.push({
        '@': {
          'xmlns': 'urn:zimbraAccount'
        },
        'owner': {
          '@': { 'by': 'name' },
          '#': email
        }

      });
      i++;
    }
    let request = {
      GetShareInfoRequest: shareInfoRequest
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

  /**
   * send a folder share request
   *
   * @param {object} options
   * @param {string} options.id - Item ID
   * @param {object} options.emailInfo - Email to receive the notification (e: Email address,
   * t: Optional Address type - (f)rom, (t)o, (c)c, (b)cc,
   * (r)eply-to, (s)ender, read-receipt (n)otification, (rf) resent-from,
   * p: The comment/name part of an address
   * @param {string} options.notes - Notes
   */
  /**
   *
   * @param {options} string
   *
   */
  this.sendShareFolderRequest = function (options, callback) {
    let defaultOptions = {
      notes: '',
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

  /** Delete Folder from Trash
   *
   * @param {number} folderId
   *
   */
  this.deleteFolderFromTrash = function (folderId, callback) {
    let request = {
      id: folderId,
      op: 'delete'
    };
    if (angular.isDefined(folderId)) {
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
      logger.error('folderId is required');
    }
  };

  /** Empty Trash
   *
   *
   */
  this.emptyTrash = function (callback) {
    let request = {
      id: 3,
      op: 'empty',
      recursive: true
    };
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
  };

  /** Get Item Request
   * @param {object} options
   * @param {number} options.id    - Item ID
   * @param {number} options.l     - Folder ID
   * @param {number} options.name  - Name
   * @param {number} options.path  - Fully qualified path
   *
   */
  this.getItem = function (request, callback) {
    return $http({
      url: $rootScope.API_URL + '/getItem',
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
   * Rename Folder
   * @param {object} options
   * @param {string} options.id - Folder ID
   * @param {string} options.name - Folder name
   */
  this.renameFolder = function (options, callback) {
    let defaultOptions = {
      op: 'rename'
    };
    let request = angular.extend({}, defaultOptions, options);
    if (angular.isDefined(request.id) && angular.isDefined(request.name)) {
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

  /**
   * Change Folder Color
   * @param {object} options
   * @param {string} options.id - Folder ID
   * @param {string} options.color - Folder color
   */
  this.changeFolderColor = function (options, callback) {
    let defaultOptions = {
      op: 'color'
    };
    let request = angular.extend({}, defaultOptions, options);
    if (angular.isDefined(request.id) && angular.isDefined(request.color)) {
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
      logger.error('id and color are required');
    }
  };

  /**
   * Exclude FreeBusy for Folder
   * @param {object} options
   * @param {string} options.id - Folder ID
   * @param {string} options.excludeFreeBusy - 0 | 1
   */
  this.excludeFreeBusyFolder = function (options, callback) {
    let defaultOptions = {
      op: 'fb',
      excludeFreeBusy: 1
    };
    let request = angular.extend({}, defaultOptions, options);
    if (angular.isDefined(request.id) && angular.isDefined(request.color)) {
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
      logger.error('id and color are required');
    }
  };

  /**
   * Move Folder
   * @param {object} options
   * @param {string} options.id - Folder ID
   * @param {string} options.l -  Destination Folder ID
   */
  this.moveFolder = function (options, callback) {
    let defaultOptions = {
      op: 'move'
    };
    let request = angular.extend({}, defaultOptions, options);
    if (angular.isDefined(request.id) && angular.isDefined(request.l)) {
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
      logger.error('id and l are required');
    }
  };
}
