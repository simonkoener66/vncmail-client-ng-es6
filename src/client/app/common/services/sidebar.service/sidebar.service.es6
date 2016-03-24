import angular from 'angular';
import createNewFolderTemplate from '../../sidebar/sidebar.folders/create.new.folder/create.new.folder.html';
import createNewTagTemplate from '../../tag/create.new.tag/create.new.tag.html';

// Modal templates for side-bar drop-down
import createNewMessageTemplate from '../../../components/mail/mail.compose/mail.compose.html';
import createNewContactTemplate from '../../../components/contacts/contact.compose/contact.compose.html';
//import createNewContactGroupTemplate from ''; // TODO: implement later
//import createNewDocumentTemplate from ''; // TODO: implement later
//import createNewTaskFolderTemplate from ''; // TODO: implement later
//import createNewContactsFolderTemplate from ''; // TODO: implement later
import createNewTaskTemplate from '../../../components/tasks/task.compose/task.compose.html';


let sidebarServiceModule = angular.module('sidebar.service', [])
  .factory('sidebarService', sidebarService);

sidebarService.$inject = ['$q', '$http', '$rootScope', '$state'];
/* @ngInject */
function sidebarService($q, $http, $rootScope, $state) {

  function getCalendars(data, cb) {
    // TODO: Populate calendar data as a tree
  }

  function getTag(data, cb) {
    return $http({
      url: $rootScope.API_URL + '/getTagList',
      method: 'GET',
      data: data
    }).success(function (res) {
      if (res.gettagresponse && res.gettagresponse.tag) {
        return cb(res.gettagresponse.tag);
      }
      return cb([]);
    })

    .error(function (res) {
      return cb(null, res);
    });

  }

  function createTag(data, cb) {
    //data.types = 'message';
    return $http({
      url: $rootScope.API_URL + '/createTag',
      method: 'POST',
      data: data
    }).success(function (res) {
      //if(res.gettagresponse && res.gettagresponse.tag){
      return cb(res);
      //}
      //return cb([]);
    })

    .error(function (res) {
      return cb(null, res);
    });

  }

  var service = {
    state: 'mail',
    getDropdownButton: getDropdownButton,
    getDropdownMenus: getDropdownMenus,
    getTag: getTag,
    getFolderMenu: getFolderMenu,
    getTagMenu: getTagMenu,
    createTag: createTag
  };

  return service;

  function getFolderMenu() {
    return $q.when({
      show: false, // show hide menu
      size: 'sm', // size of menu lg, md, sm (Optional)
      items: [
        {
          name: 'Expand all', // name of item
          state: 'mail.inbox',
          type: 'function', // type of item (link , function)
          itemFunction: () => {
            $rootScope.$broadcast('expand-folder');
          }
        },
        {
          name: 'Create new folder',
          template: createNewFolderTemplate,
          use_ctrl: 'CreateNewFolderController',
          size: 'md',
          backdrop: true,
          type: 'modal',
          child: []
        }
      ]
    });
  }

  function getTagMenu() {
    return $q.when({
      show: false,
      size: 'sm',
      items: [
        { // for open modal on item click
          name: 'Create new tag',
          template: createNewTagTemplate,
          use_ctrl: 'CreateNewTagController',
          size: 'md',
          backdrop: true,
          type: 'modal'
        }
      ]
    });
  }

  function getCalendarMenu() {
    // TODO: populate calendar check-able tree
  }

  function getDropdownMenus() {
    return $q.when({
      show: false,
      size: 'sm',
      items: [{
        name: 'Message',
        template: createNewMessageTemplate,
        'use_ctrl': 'MailComposeController',
        icon_name: 'email',
        icon_size: '20',
        backdrop: true,
        type: 'modal'
      }, {
        name: 'Contact',
        template: createNewContactTemplate, // createNewContactTemplate,
        'use_ctrl': 'ContactComposeController',
        icon_name: 'account_circle',
        icon_size: '20',
        backdrop: true,
        type: 'modal'
      }, {
        name: 'Contact Group',
        template: '', // createNewContactGroupTemplate,
        'use_ctrl': 'CreateNewContactGroupController',
        icon_name: 'group',
        icon_size: '20',
        backdrop: true,
        type: 'modal'
      }, {
        name: 'Document',
        template: '', // createNewDocumentTemplate,
        'use_ctrl': 'CreateNewDocumentController',
        icon_name: 'description',
        icon_size: '20',
        backdrop: true,
        type: 'modal'
      },
      {
        name: 'Folder',
        template: createNewFolderTemplate,
        'use_ctrl': 'CreateNewFolderController',
        icon_name: 'folder',
        icon_size: '20',
        icon_color: '#757575',
        backdrop: true,
        type: 'modal'
      }, {
        name: 'Tag',
        template: createNewTagTemplate,
        'use_ctrl': 'CreateNewTagController',
        icon_name: 'loyalty',
        icon_size: '20',
        backdrop: true,
        type: 'modal'
      }, {
        name: 'Task Folder',
        template: '', // createNewTaskFolderTemplate,
        'use_ctrl': 'CreateNewTaskFolderController',
        icon_name: 'assignment',
        icon_size: '20',
        backdrop: true,
        type: 'modal'
      }, {
        name: 'Contacts Folder',
        template: '', // createNewContactsFolderTemplate,
        'use_ctrl': 'CreateNewContactsFolderController',
        icon_name: 'contact_mail',
        icon_size: '20',
        backdrop: true,
        type: 'modal'
      }]
    });
  }

  function getDropdownButton() {
    let label, template, controller;
    let state = $state.current.name.split('.')[0];
    switch (state) {
    case 'mail':
      label = 'New Message';
           template = createNewMessageTemplate;
           controller = 'MailComposeController';
      break;
    case 'tasks':
      label = 'New Task';
      template = createNewTaskTemplate;
      controller = 'TaskComposeController';
      break;
    case 'contacts':
      label = 'New Contact';
      template = createNewContactTemplate;
      controller = 'ContactComposeController';
      break;
    default:
      break;
    }

    return $q.when({
      label: label,
      template: template,
      useCtrl: controller,
    });
  }
}


export default sidebarServiceModule;
