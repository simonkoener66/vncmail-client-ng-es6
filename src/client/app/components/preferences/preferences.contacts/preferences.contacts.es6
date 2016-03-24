//change as task need
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import preferencesContactsComponent from './preferencesContacts.component';
import coreModule from '../../../common/core/core';
import './_preferencesContacts.scss';
import './preferencesContacts.html';
let preferencesContactsModule = angular.module('preferencesContacts', [
  uiRouter, coreModule.name
])

.run(appRun)

.directive('preferencesContacts', preferencesContactsComponent);

appRun.$inject = ['routerHelper'];
/* @ngInject */

function appRun( routerHelper ) {
  "ngInject";
  routerHelper.configureStates(getStates());
}

function getStates() {
  return [
    {
      state: 'preferences.contacts',
      config: {
        url: '/contacts',
        template: '<preferences-contacts></preferences-contacts>',
        title: 'Contacts',
        settings: {
          nav: 2,
          content: 'Contacts',
          icon: '../images/ic_contact_mail_black_24px.svg'
        }
      }
    }
  ];
}
export default preferencesContactsModule;
