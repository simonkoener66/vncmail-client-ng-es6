import angular from 'angular';
import uiRouter from 'angular-ui-router';
import PreferencesComponent from './preferences.component';
import coreModule from '../../common/core/core';
import PreferencesGeneralModule from './prefereness.general/preferences.general';
import PreferencesAccountsModule from './preferences.accounts/preferences.accounts';
import PreferencesMailModule from './preferences.mail/preferences.mail';
import PreferencesFilterModule from './preferences.filters/preferences.filters';
import PreferencesSignaturesModule from './preferences.signatures/preferences.signatures';
import PreferencesOutOfOfficeModule from './preferences.outOfOffice/preferences.outOfOffice';
import PreferencesTrustedAddressesModule from './preferences.trustedAddresses/preferences.trustedAddresses';
import PreferencesContactsModule from './preferences.contacts/preferences.contacts';
import PreferencesCalenderModule from './preferences.calender/preferences.calender';
import PreferencesSharingModule from './preferences.sharing/preferences.sharing';
import PreferencesNotificationModule from './preferences.notification/preferences.notification';
import PreferencesMobileDevicesModule from './preferences.mobileDevices/preferences.mobileDevices';
import ImportModule from './preferences.import/preferences.import';
import ExportModule from './preferences.export/preferences.export';
import PreferencesZimletsModule from './preferences.zimlets/preferences.zimlets';
import './_preferences.scss';
let preferencesModule = angular.module('preferences', [
  uiRouter,
  coreModule.name,
  PreferencesGeneralModule.name,
  PreferencesAccountsModule.name,
  PreferencesMailModule.name,
  PreferencesFilterModule.name,
  PreferencesSignaturesModule.name,
  PreferencesOutOfOfficeModule.name,
  PreferencesTrustedAddressesModule.name,
  PreferencesContactsModule.name,
  PreferencesCalenderModule.name,
  PreferencesSharingModule.name,
  PreferencesNotificationModule.name,
  PreferencesMobileDevicesModule.name,
  ImportModule.name,
  ExportModule.name,
  PreferencesZimletsModule.name
])

.config(defaultPreferencesState)

.run(appRun)

.directive('preferences', PreferencesComponent);

defaultPreferencesState.$inject = ['$urlRouterProvider'];

function defaultPreferencesState( $urlRouterProvider ){
  $urlRouterProvider.when('/preferences', '/preferences/import');
}
appRun.$inject = ['routerHelper', '$translate'];
/* @ngInject */

function appRun( routerHelper, $translate ) {
    "ngInject";
    routerHelper.configureStates(getStates($translate));
}

function getStates($translate) {
    return [
        {
            state: 'preferences',
            config: {
                url: '/preferences',
                template: '<preferences></preferences>',
                title: 'Preferences',
                settings: {
                    nav: 1,
                    content: $translate('COMMON.PREFERENCES'),
                    tooltip: 'View or edit your options',
                    icon: 'settings_application'
                }
            }
        }
    ];
}
export default preferencesModule;
