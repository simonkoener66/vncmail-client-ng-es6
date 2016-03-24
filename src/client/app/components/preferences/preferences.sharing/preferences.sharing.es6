import angular from 'angular';
import uiRouter from 'angular-ui-router';
import preferencesSharingComponent from './preferences.sharing.component';
import coreModule from '../../../common/core/core';
import './_preferences.sharing.scss';
let preferencesSharingModule = angular.module('preferences.sharing', [
  uiRouter, coreModule.name
])

.run(appRun)

.directive('preferencesSharing', preferencesSharingComponent);

appRun.$inject = ['routerHelper'];
/* @ngInject */

function appRun( routerHelper ) {
  "ngInject";
  routerHelper.configureStates(getStates());
}

function getStates() {
  return [
    {
      state: 'preferences.sharing',
      config: {
        url: '/sharing',
        template: '<preferences-sharing></preferences-sharing>',
        title: 'Sharing',
        settings: {
          nav: 2,
          content: 'Sharing',
          icon: '../images/ic_supervisor_account_black_24px.svg'
        }
      }
    }
  ];
}
export default preferencesSharingModule;
