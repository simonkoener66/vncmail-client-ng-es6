import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ImportComponent from './preferences.import.component';
import coreModule from '../../../common/core/core';
import './_preferences.import.scss';
let ImportModule = angular.module('import', [
  uiRouter, coreModule.name
])

.run(appRun)

.directive('import', ImportComponent);

appRun.$inject = ['routerHelper'];
/* @ngInject */

function appRun( routerHelper ) {
  "ngInject";
  routerHelper.configureStates(getStates());
}

function getStates() {
  return [
    {
      state: 'preferences.import',
      config: {
        url: '/import',
        template: '<import></import>',
        title: 'Import',
        settings: {
          nav: 2,
          content: 'Import',
          icon: '../images/ic_swap_horiz_black_24px.svg'
        }
      }
    }
  ];
}
export default ImportModule;
