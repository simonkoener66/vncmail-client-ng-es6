import angular from 'angular';
import uiRouter from 'angular-ui-router';
import PreferencesGeneralComponent from './preferences.general.component';
import coreModule from '../../../common/core/core';
import './preferences.general.scss';
let PreferencesGeneralModule = angular.module('preferences.general', [
  uiRouter, coreModule.name
])

.run(appRun)

.directive('preferencesGeneral', PreferencesGeneralComponent);

appRun.$inject = ['routerHelper'];
/* @ngInject */

function appRun( routerHelper ) {
  "ngInject";
  routerHelper.configureStates(getStates());
}

function getStates() {
  return [
    {
      state: 'preferences.general',
      config: {
        url: '/general',
        template: '<preferences-general></preferences-general>',
        title: 'General',
        settings: {
          nav: 2,
          content: 'General',
          icon: '../images/ic_settings_black_24px.svg'
        }
      }
    }
  ];
}
export default PreferencesGeneralModule;
