import angular from 'angular';
import uiRouter from 'angular-ui-router';
import preferencesZimletsComponent from './preferences.zimlets.component';
import coreModule from '../../../common/core/core';
import './_preferences.zimlets.scss';
let preferencesZimletsModule = angular.module('preferences.zimlets', [
  uiRouter, coreModule.name
])

.run(appRun)

.directive('preferencesZimlets', preferencesZimletsComponent);

appRun.$inject = ['routerHelper'];
/* @ngInject */

function appRun( routerHelper ) {
  "ngInject";
  routerHelper.configureStates(getStates());
}

function getStates() {
  return [
    {
      state: 'preferences.zimlets',
      config: {
        url: '/zimlets',
        template: '<preferences-zimlets></preferences-zimlets>',
        title: 'Zimlets',
        settings: {
          nav: 2,
          content: 'Zimlets',
          icon: '../images/zimlet-01.svg'
        }
      }
    }
  ];
}
export default preferencesZimletsModule;
