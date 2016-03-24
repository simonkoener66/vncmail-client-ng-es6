import angular from 'angular';
import uiRouter from 'angular-ui-router';
import preferencesSignaturesComponent from './preferences.signatures.component';
import coreModule from '../../../common/core/core';
import './_preferences.signatures.scss';
let preferencesSignaturesModule = angular.module('preferences.signatures', [
  uiRouter, coreModule.name
])

.run(appRun)

.directive('preferencesSignatures', preferencesSignaturesComponent);

appRun.$inject = ['routerHelper'];
/* @ngInject */

function appRun( routerHelper ) {
  "ngInject";
  routerHelper.configureStates(getStates());
}

function getStates() {
  return [
    {
      state: 'preferences.signatures',
      config: {
        url: '/signatures',
        template: '<preferences-signatures></preferences-signatures>',
        title: 'Signatures',
        settings: {
          nav: 2,
          content: 'Signatures',
          icon: '../images/ic_edit_black_24px.svg'
        }
      }
    }
  ];
}
export default preferencesSignaturesModule;
