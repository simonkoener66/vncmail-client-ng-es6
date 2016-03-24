import angular from 'angular';
import uiRouter from 'angular-ui-router';
import preferencesTrustedAddressesComponent from './preferences.trustedAddresses.component';
import coreModule from '../../../common/core/core';
import './_preferences.trustedAddresses.scss';
let preferencesTrustedAddressesModule = angular.module('preferences.trustedAddresses', [
  uiRouter, coreModule.name
])

.run(appRun)

.directive('preferencesTrustedAddresses', preferencesTrustedAddressesComponent);

appRun.$inject = ['routerHelper'];
/* @ngInject */

function appRun( routerHelper ) {
  "ngInject";
  routerHelper.configureStates(getStates());
}

function getStates() {
  return [
    {
      state: 'preferences.trustedAddresses',
      config: {
        url: '/trustedAddresses',
        template: '<preferences-trusted-addresses></preferences-trusted-addresses>',
        title: 'TrustedAddresses',
        settings: {
          nav: 2,
          content: 'Trusted Addresses',
          icon: '../images/ic_verified_user_black_24px.svg'
        }
      }
    }
  ];
}
export default preferencesTrustedAddressesModule;
