import angular from 'angular';
import uiRouter from 'angular-ui-router';
import preferencesMailComponent from './preferences.mail.component';
import coreModule from '../../../common/core/core';
import './_preferences.mail.scss';
let preferencesMailModule = angular.module('preferences.mail', [
  uiRouter, coreModule.name
])

.run(appRun)

.directive('preferencesMail', preferencesMailComponent);

appRun.$inject = ['routerHelper'];
/* @ngInject */

function appRun( routerHelper ) {
  "ngInject";
  routerHelper.configureStates(getStates());
}

function getStates() {
  return [
    {
      state: 'preferences.mail',
      config: {
        url: '/mail',
        template: '<preferences-mail></preferences-mail>',
        title: 'Mail',
        settings: {
          nav: 2,
          content: 'Mail',
          icon: '../images/ic_email_black_24px.svg'
        }
      }
    }
  ];
}
export default preferencesMailModule;
