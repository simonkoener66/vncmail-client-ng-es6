import angular from 'angular';
import uiRouter from 'angular-ui-router';
import coreModule from '../core.module.es6';
let contactService = angular.module('core.app')
  .service('contactService', contactService);

//TODO: when all services checked for contact, folder, task and calendar then it should be disconnected from mailService

function contactService( $q, $http, $rootScope, logger, $log, vncConstant ){

  this.filterContact = function (options, callback) {
    let defaultOptions = {
      sortBy: 'nameAsc',
      offset: 0,
      limit: 100,
      needExp: 1,
      query: 'in:contacts',
      types: 'contact',
      tz: {
        id: 'Asia/Bangkok'
      },
      locale: 'en_US'
    };

    let request = angular.extend({}, defaultOptions, options);
    return $http({
      url: $rootScope.API_URL + '/searchRequest',
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

  this.filterTagContact = function (options, callback) {
    let defaultOptions = {
      sortBy: 'nameAsc',
      offset: 0,
      limit: 100,
      needExp: 1,
      query: 'tag:"your tag"',
      types: 'contact',
      tz: {
        id: 'Asia/Bangkok'
      },
      cursor: {
        endSortVal: 'D', // The next alphabet used to search; A for search number
        id: 0,
        sortVal: 'C' // The alphabet used to search; 0 for search number
      },
      locale: 'en_US'
    };

    let request = angular.extend({}, defaultOptions, options);
    return $http({
      url: $rootScope.API_URL + '/searchRequest',
      method: 'POST',
      data: request
    }).success(function (res) {
      if (typeof callback === 'function') {
        callback(res.cn);
      }

    }).error(function (res) {
      if (typeof callback === 'function') {
        callback(null, res);
      }
    });
  };

  this.filterTrashContact = function (options, callback) {
    let defaultOptions = {
      sortBy: 'nameAsc',
      offset: 0,
      limit: 100,
      needExp: 1,
      query: 'in:trash',
      types: 'contact',
      tz: {
        id: 'Asia/Bangkok'
      },
      cursor: {
        endSortVal: 'D', // The next alphabet used to search; A for search number
        id: 0,
        sortVal: 'C' // The alphabet used to search; 0 for search number
      },
      locale: 'en_US'
    };

    let request = angular.extend({}, defaultOptions, options);
    return $http({
      url: $rootScope.API_URL + '/searchRequest',
      method: 'POST',
      data: request
    }).success(function (res) {
      if (typeof callback === 'function') {
        callback(res.cn);
      }

    }).error(function (res) {
      if (typeof callback === 'function') {
        callback(null, res);
      }
    });
  };

  this.filterEmailedContact = function (options, callback) {
    let defaultOptions = {
      sortBy: 'nameAsc',
      offset: 0,
      limit: 100,
      needExp: 1,
      query: 'in:"Emailed Contacts"',
      types: 'contact',
      tz: {
        id: 'Asia/Bangkok'
      },
      cursor: {
        endSortVal: 'D', // The next alphabet used to search; A for search number
        id: 0,
        sortVal: 'C' // The alphabet used to search; 0 for search number
      },
      locale: 'en_US'
    };

    let request = angular.extend({}, defaultOptions, options);
    return $http({
      url: $rootScope.API_URL + '/searchRequest',
      method: 'POST',
      data: request
    }).success(function (res) {
      if (typeof callback === 'function') {
        callback(res.cn);
      }

    }).error(function (res) {
      if (typeof callback === 'function') {
        callback(null, res);
      }
    });
  };

  this.getContacts = function (options, callback) {
    let defaultOptions = {
      sortBy: 'nameAsc',
      offset: 0,
      limit: 100,
      fetch: 1,
      needExp: 1,
      query: 'in:contacts',
      types: 'contact',
      tz: {
        id: 'Asia/Bangkok'
      },
      locale: 'en_US'
    };

    let request = angular.extend({}, defaultOptions, options);
    return $http({
      url: $rootScope.API_URL + '/searchRequest',
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

  // search contacts
  this.searchContacts = function (options, callback) {
    let defaultOptions = {
      sortBy: 'nameAsc',
      offset: 0,
      limit: 100,
      fetch: 1,
      needExp: 1,
      query: '',
      types: 'contact',
      tz: {
        id: 'Asia/Bangkok'
      },
      locale: 'en_US'
    };

    let request = angular.extend({}, defaultOptions, options);
    return $http({
      url: $rootScope.API_URL + '/searchRequest',
      method: 'POST',
      data: request
    }).success(function (res) {
      if (typeof callback === 'function') {
        if ( angular.isDefined(res.cn) ) {
          callback(res);
        } else {
          callback([]);
        }
      }

    }).error(function (res) {
      if (typeof callback === 'function') {
        callback(null, res);
      }
    });
  };


  /**
   * Move contact
   * @param {object} options
   * @param {number} options.id - Contact ID
   * @param {number} options.l - Folder ID
   */

  this.moveContact = function (options, callback) {
    let defaultOptions = {
      op: 'move',
      l: 7
    };
    let request = angular.extend({}, defaultOptions, options);
    if (angular.isDefined(request.id)) {
      return $http({
        url: $rootScope.API_URL + '/contactAction',
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
      logger.error('Id is required');
    }
  };

  /**
   * Delete a contact from trash
   * @param {number} contactId - Contact ID
   */
  this.deleteContactFromTrash = function (contactId, callback) {
    let request = {
      op: 'delete',
      id: contactId
    };

    if (angular.isDefined(request.id)) {
      return $http({
        url: $rootScope.API_URL + '/contactAction',
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
      logger.error('Id is required');
    }
  };

  /**
   * Create a folder
   * @param {object} options
   * @param {string} options.name - If "l" is unset, name is the full path of the new folder;
   * @param {number} options.color - color numeric; range 0-127;
   */
  this.createContactFolder = function (options, callback) {
    let defaultOptions = {
      view: 'contact',
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

  /** Create Contact
   *
   * @param {object} options
   * @param {number} options.folderId
   * @param {object} options.contactAttrs
   *
   */
  this.createContact = function (options, callback) {
    let defaultOptions = {
      folderId: 7
    };
    let request = angular.extend({}, defaultOptions, options);
    if (angular.isDefined(request.contactAttrs)) {
      return $http({
        url: $rootScope.API_URL + '/createContact',
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
      logger.error('contactAttrs is required');
    }
  };

  /** Modify Contact
   *
   * @param {object} options
   * @param {number} options.id
   * @param {object} options.contactAttrs
   *
   */
  this.modifyContact = function (options, callback) {
    let defaultOptions = {};
    let request = angular.extend({}, defaultOptions, options);
    if (angular.isDefined(request.contactAttrs) && angular.isDefined(request.id)) {
      return $http({
        url: $rootScope.API_URL + '/modifyContact',
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
      logger.error('id and contactAttrs are required');
    }
  };

  /** Delete Contact
   *
   * @param {number} contactId
   *
   */
  this.deleteContact = function (options, callback) {
    let defaultOptions = {
      id: options.id,
      folderId: 3,
      op: 'move'
    };
    let request = angular.extend({}, defaultOptions, options);
    if (angular.isDefined(options.id)) {
      return $http({
        url: $rootScope.API_URL + '/contactAction',
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
      logger.error('contact_id is required');
    }
  };

  /** Move Contact
   *
   * @param {number} contactId
   * @param {number} folderId
   *
   */
  this.moveContact = function (contactId, folderId, callback) {
    if (angular.isDefined(contactId) && angular.isDefined(folderId)) {
      let request = {
        id: contactId,
        folderId: folderId,
        op: 'move'
      };
      return $http({
        url: $rootScope.API_URL + '/contactAction',
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
      logger.error('contactId and folderId are required');
    }
  };

  /** Assign Tag to Contact
   *
   * @param {number} contactId
   * @param {string} tags
   *
   */
  this.assignTagToContact = function (contactId, tags, callback) {
    if (angular.isDefined(contactId) && angular.isDefined(tags)) {
      let request = {
        op: 'tag',
        tn: tags,
        id: contactId
      };
      return $http({
        url: $rootScope.API_URL + '/contactAction',
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
      logger.error('contactId and tags are required');
    }
  };

  /** Remove Tag In Contact
   *
   * @param {number} contactId
   * @param {string} tags
   *
   */
  this.removeTagInContact = function (contactId, tags, callback) {
    if (angular.isDefined(contactId) && angular.isDefined(tags)) {
      let request = {
        op: '!tag',
        tn: tags,
        id: contactId
      };
      return $http({
        url: $rootScope.API_URL + '/contactAction',
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
      logger.error('contactId and tags are required');
    }
  };

  /** Remove All Tag In Contact
   *
   * @param {number} contactId
   *
   */
  this.removeAllTagInContact = function (contactId, callback) {
    if (angular.isDefined(contactId)) {
      let request = {
        op: 'update',
        tn: '',
        id: contactId
      };
      return $http({
        url: $rootScope.API_URL + '/contactAction',
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
      logger.error('contactId and tags are required');
    }
  };
}
