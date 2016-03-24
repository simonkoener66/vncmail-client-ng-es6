import angular from 'angular';
import uiRouter from 'angular-ui-router';
import PreferencesNotificationComponent from './preferences.notification.component';
import coreModule from '../../../common/core/core';
import './preferences.notification.scss';
let PreferencesNotificationModule = angular.module('preferences.notification', [
  uiRouter, coreModule.name
])

.run(appRun)

.directive('preferencesNotification', PreferencesNotificationComponent);

appRun.$inject = ['routerHelper'];
/* @ngInject */

function appRun( routerHelper ) {
  "ngInject";
  routerHelper.configureStates(getStates());
}

function getStates() {
  return [
    {
      state: 'preferences.notification',
      config: {
        url: '/notification',
        template: '<preferences-notification></preferences-notification>',
        title: 'Notification',
        settings: {
          nav: 2,
          content: 'Notification',
          icon: '../images/ic_notifications_active_black_24px.svg'
        }
      }
    }
  ];
}
export default PreferencesNotificationModule;
