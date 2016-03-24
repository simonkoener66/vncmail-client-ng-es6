import angular from 'angular';
import uiRouter from 'angular-ui-router';
import preferencesMobileDevicesComponent from './preferences.mobileDevices.component';
import coreModule from '../../../common/core/core';
import './_preferences.mobileDevices.scss';
let preferencesMobileDevicesModule = angular.module('preferences.mobileDevices', [
  uiRouter, coreModule.name
])

.run(appRun)

.directive('preferencesMobileDevices', preferencesMobileDevicesComponent);

appRun.$inject = ['routerHelper'];
/* @ngInject */

function appRun( routerHelper ) {
  "ngInject";
  routerHelper.configureStates(getStates());
}

function getStates() {
  return [
    {
      state: 'preferences.mobileDevices',
      config: {
        url: '/mobileDevices',
        template: '<preferences-mobile-Devices></preferences-mobile-Devices>',
        title: 'MobileDevices',
        settings: {
          nav: 2,
          content: 'MobileDevices',
          icon: '../images/ic_stay_primary_portrait_black_24px.svg'
        }
      }
    }
  ];
}
export default preferencesMobileDevicesModule;
