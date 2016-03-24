const HTTP = new WeakMap();
const LOGGER = new WeakMap();

//import createNewCalendarTemplate from '../sidebar.dropdown.button/create.new.calendar/createNewCalendarModal.html';

class SidebarCalendarFolderService {
  /* @ngInject */
  constructor($http, logger, calendarService, mailService, vncConstant) {
    let service = this;
    service.calendarService = calendarService;
    service.mailService = mailService;
    service.vncConstant = vncConstant;

    service.selectedCalendarFolder = {};
    service.calendarFolders = [];
    service.calendarFolderStateMap = new Map();
    service.checkedCalendarFolderMap = new Map();
    service.uncheckedCalendarFolderMap = new Map();

    HTTP.set(service, $http);
    LOGGER.set(service, logger);
  }

  /** Public **/

  get SelectedCalendarFolder() {
    let service = this;
    return service.selectedCalendarFolder;
  }
  set SelectedCalendarFolder(value) {
    let service = this;
    service.selectedCalendarFolder = value;
  }

  get CheckedCalendarFolderMap() {
    let service = this;
    return service.checkedCalendarFolderMap;
  }

  /**
   * Gets and Array of checked calendar folder IDs.
   * Eg. ['1', '2', '3']
   */
  get CheckedCalendarFolderIds() {
    let service = this;
    return [...service.checkedCalendarFolderMap.keys()];
  }
  get CheckedCalendarFolders() {
    let service = this;
    return [...service.checkedCalendarFolderMap.entries()];
  }

  /**
   * Gets and Array of un-checked calendar folder IDs.
   * Eg. ['1', '2', '3']
   */
  get UncheckedCalendarFolderIds() {
    let service = this;
    return [...service.uncheckedCalendarFolderMap.keys()];
  }
  get UncheckedCalendarFolders() {
    let service = this;
    return [...service.uncheckedCalendarFolderMap.entries()];
  }

  updateCalendarCheckStateRecursively(node, isChecked, errorCallback) {
    let service = this;
    if (service.calendarFolderStateMap.has(node.$.id)) {
      service.calendarFolderStateMap.delete(node.$.id);
    }

    service.calendarFolderStateMap.set(node.$.id, isChecked);

    if (isChecked) {
      // remove from the un-checked map
      if (service.uncheckedCalendarFolderMap.has(node.$.id)) {
        service.uncheckedCalendarFolderMap.delete(node.$.id);
      }

      // add to the checked map
      service.checkedCalendarFolderMap.set(node.$.id, isChecked);
    } else {
      // remove from the checked map
      if (service.checkedCalendarFolderMap.has(node.$.id)) {
        service.checkedCalendarFolderMap.delete(node.$.id);
      }

      // add to the un-checked map
      service.uncheckedCalendarFolderMap.set(node.$.id, isChecked);
    }

    if (node.folder && node.folder.length > 0) {
      for (let subFolder of node.folder) {
        subFolder.isChecked = isChecked;

        // recursively update the grand-children
        service.updateCalendarCheckStateRecursively(subFolder, isChecked);
      }
    }

    // update to Zimbra
    service.mailService.makeFolderActions(service.calendarFolderStateMap.entries(), (response, error) => {
      if (error && error.status === 'failed') {
        LOGGER.get(service).error(error.msg);
      } else {
        service.calendarFolderStateMap.clear();
      }
    });
  }

  /**
   * Send a request to get user's all calendar folder.
   * @param {function} successCallback handles when the data was successfully retrieved.
   * @param {function} errorCallback   handles when error.
   */
  getUserCalendarTree(successCallback, errorCallback) {
    let service = this;

    // reset
    service.checkedCalendarFolderMap = new Map();
    service.uncheckedCalendarFolderMap = new Map();

    HTTP.get(service).post(
      service.apiUrl + '/getFolderList',
      {view: 'appointment'}
    ).success((res) => {
      if (res.folder) {
        // ignore the USER_ROOT folder (ID: 1)
        service.prepareCalendarFolders(res.folder.folder);
      }

      let calendarFolders = res.folder.folder;

      if (res.folder.link) {
        let link = res.folder.link;

        if (angular.isArray(link)) {
          for (let sharedFolder of link) {
            sharedFolder.$.isLink = true;
            // insert those link-folder before the trash.
            calendarFolders.splice(calendarFolders.length - 1, 0 , sharedFolder);
          }
        } else {
          link.$.isLink = true;
          calendarFolders.splice(calendarFolders.length - 1, 0 , link);
        }
      }

      service.calendarFolders = calendarFolders;

      /* Notify that we have got the calendar/category folder.
       * Now the controllers can make a request for appointment data.
       **/
      service.calendarService.IsReady = true;

      if (typeof successCallback === 'function') {
        successCallback(calendarFolders);
      }
    }).error((res) => {
      if (typeof errorCallback === 'function') {
        errorCallback(res);
      }
    });
  }

  prepareCalendarFolders(folders) {
    let service = this;

    for (let folder of folders) {
      // set check-state
      let isChecked = (folder.$.f && folder.$.f.indexOf('#') >= 0) ? true : false;
      if (isChecked) {
        service.checkedCalendarFolderMap.set(folder.$.id, folder);
      } else {
        service.uncheckedCalendarFolderMap.set(folder.$.id, folder);
      }

      folder.isChecked = isChecked;

      if (folder.folder) {
        if (!angular.isArray(folder.folder)) {
          // Helps when display hierarchical template on the tree.
          folder.folder = [folder.folder];
        }

        service.prepareCalendarFolders(folder.folder);
      }
    }
  }
}

/*
let sidebarCalendarFolderService = ($rootScope, $q, logger, mailService) => {


  let getCalendarExternalMenu = () => {
    return $q.when({
      show: false, // show hide menu
      size: 'sm', // size of menu lg, md, sm (Optional)
      items: [
        {
          name: 'New Calendar',
          icon_name: 'create-new-folder',
          icon_size: 18,
//          template: createNewCalendarTemplate,
//          use_ctrl: 'CreateNewFolderController',
//          size: 'md',
//          backdrop: true,
          type: 'modal',
          child: []
        }, {
          name: 'Add External Calendar',
          icon_name: 'folder-shared',
          icon_size: 18,
//          template: createNewCalendarTemplate,
//          use_ctrl: 'CreateNewFolderController',
//          size: 'md',
//          backdrop: true,
          type: 'modal',
          child: []
        }, {
          name: 'Check All', // name of item,
          icon_name: 'done-all',
          icon_size: 18,
          type: 'function', // type of item (link , function)
          itemFunction: () => {
            $rootScope.$broadcast('check-all-calendars');
          }
        }, {
          name: 'Clear All', // name of item
          icon_name: 'clear',
          icon_size: 18,
          type: 'function', // type of item (link , function)
          itemFunction: () => {
            $rootScope.$broadcast('uncheck-all-calendars');
          }
        }, {
          type: 'divider'
        }, {
          name: 'Send Free and Busy Link As',
//          template: createNewCalendarTemplate,
//          use_ctrl: 'CreateNewFolderController',
//          size: 'md',
//          backdrop: true,
          type: 'modal',
          child: [
            {
              name: 'HTML',
            }, {
              name: 'ICS',
            }, {
              name: 'ICS Event',
            }
          ]
        }, {
          name: 'Find Share',
        }
      ]
    });
  };

  let getCalendarInternalMenu = () => {
    return $q.when({
      show: false, // show hide menu
      size: 'sm', // size of menu lg, md, sm (Optional)
      items: [
        {
          name: 'Expand all', // name of item
          state: 'mail.inbox',
          type: 'function', // type of item (link , function)
          itemFunction: () => {
            $rootScope.$broadcast('check-all-calendars');
          }
        },
        {
          name: 'Create new folder',
//          template: createNewCalendarTemplate,
//          use_ctrl: 'CreateNewFolderController',
//          size: 'md',
//          backdrop: true,
//          type: 'modal',
          child: []
        }
      ]
    });
  };

  let service = {
    selectedCalendarNode: {},
    getCalendarTreeOptions: () => {
      return calendarTreeOptions;
    },
    getCalendarExternalMenu: getCalendarExternalMenu,
    getCalendarInternalMenu: getCalendarInternalMenu,
    checkNodeRecursively: checkNodeRecursively
  };

  return service;
};

sidebarCalendarFolderService.$inject = ['$rootScope', '$q', 'logger', 'mailService'];
*/

export default SidebarCalendarFolderService;
