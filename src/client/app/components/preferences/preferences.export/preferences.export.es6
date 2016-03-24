import angular from 'angular';
import uiRouter from 'angular-ui-router';
import exportComponent from './preferences.export.component';
import coreModule from '../../../common/core/core';
import './_preferences.export.scss';
let exportModule = angular.module('export', [
  uiRouter, coreModule.name
])

.run(appRun)

.directive('export', exportComponent);

appRun.$inject = ['routerHelper'];
/* @ngInject */

function appRun( routerHelper ) {
  "ngInject";
  routerHelper.configureStates(getStates());
}

function getStates() {
  return [
    {
      state: 'preferences.export',
      config: {
        url: '/export',
        template: '<export></export>',
        title: 'Export',
        settings: {
          nav: 2,
          content: 'Export',
          icon: '../images/ic_swap_horiz_black_24px.svg'
        }
      }
    }
  ];
}
export default exportModule;
