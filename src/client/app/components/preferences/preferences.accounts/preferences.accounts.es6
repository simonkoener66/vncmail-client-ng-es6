import angular from 'angular';
import uiRouter from 'angular-ui-router';
import DelegatePopupController from './delegatePopup/delegatePopup.controller';
import preferencesAccountsComponent from './preferences.accounts.component';
import coreModule from '../../../common/core/core';
import './_preferences.accounts.scss';
let preferencesAccountsModule = angular.module('preferences.accounts', [
  uiRouter, coreModule.name
])

.run(appRun)

.controller('DelegatePopupController', DelegatePopupController)
.directive('preferencesAccounts', preferencesAccountsComponent);

appRun.$inject = ['routerHelper'];
/* @ngInject */

function appRun( routerHelper ) {
  "ngInject";
  routerHelper.configureStates(getStates());
}

function getStates() {
  return [
    {
      state: 'preferences.accounts',
      config: {
        url: '/accounts',
        template: '<preferences-accounts></preferences-accounts>',
        title: 'Accounts',
        settings: {
          nav: 2,
          content: 'Accounts',
          icon: '../images/ic_account_box_black_24px.svg'
        }
      }
    }
  ];
}
export default preferencesAccountsModule;
