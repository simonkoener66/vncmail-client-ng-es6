import angular from 'angular';
import uiRouter from 'angular-ui-router';
import preferencesOutOfOfficeComponent from './preferences.outOfOffice.component';
import coreModule from '../../../common/core/core';
import './_preferences.outOfOffice.scss';
let preferencesOutOfOfficeModule = angular.module('preferences.outOfOffice', [
  uiRouter, coreModule.name
])

.run(appRun)

.directive('preferencesOutOfOffice', preferencesOutOfOfficeComponent);

appRun.$inject = ['routerHelper'];
/* @ngInject */

function appRun( routerHelper ) {
  "ngInject";
  routerHelper.configureStates(getStates());
}

function getStates() {
  return [
    {
      state: 'preferences.outOfOffice',
      config: {
        url: '/outOfOffice',
        template: '<preferences-out-of-office></preferences-out-of-office>',
        title: 'OutOfOffice',
        settings: {
          nav: 2,
          content: 'Out Of Office',
          icon: '../images/ic_airplanemode_active_black_24px.svg'
        }
      }
    }
  ];
}
export default preferencesOutOfOfficeModule;
