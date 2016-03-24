import angular from 'angular';
import uiRouter from 'angular-ui-router';
import preferencesFiltersComponent from './preferences.filters.component';
import coreModule from '../../../common/core/core';
import './_preferences.filters.scss';
let preferencesFiltersModule = angular.module('preferences.filters', [
  uiRouter, coreModule.name
])

.run(appRun)

.directive('preferencesFilters', preferencesFiltersComponent);

appRun.$inject = ['routerHelper'];
/* @ngInject */

function appRun( routerHelper ) {
  "ngInject";
  routerHelper.configureStates(getStates());
}

function getStates() {
  return [
    {
      state: 'preferences.filters',
      config: {
        url: '/filters',
        template: '<preferences-filters></preferences-filters>',
        title: 'Filters',
        settings: {
          nav: 2,
          content: 'Filters',
          icon: '../images/ic_call_split_black_24px.svg'
        }
      }
    }
  ];
}
export default preferencesFiltersModule;
