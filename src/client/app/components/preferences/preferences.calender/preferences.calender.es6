import angular from 'angular';
import uiRouter from 'angular-ui-router';
import preferencesCalenderComponent from './preferences.calender.component';
import coreModule from '../../../common/core/core';
import './_preferences.calender.scss';
let PreferencesCalenderModule = angular.module('preferences.calender', [
  uiRouter, coreModule.name
])

.run(appRun)

.directive('preferencesCalender', preferencesCalenderComponent);

appRun.$inject = ['routerHelper'];
/* @ngInject */

function appRun( routerHelper ) {
  "ngInject";
  routerHelper.configureStates(getStates());
}

function getStates() {
  return [
    {
      state: 'preferences.calender',
      config: {
        url: '/calender',
        template: '<preferences-calender></preferences-calender>',
        title: 'Calender',
        settings: {
          nav: 2,
          content: 'Calender',
          icon: '../images/ic_insert_invitation_black_24px.svg'
        }
      }
    }
  ];
}
export default PreferencesCalenderModule;
