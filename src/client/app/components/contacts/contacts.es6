import angular from 'angular';
import uiRouter from 'angular-ui-router';
import contactsComponent from './contacts.component';
import coreModule from '../../common/core/core';
import contactsContacts from './contacts.contacts/contacts.contacts';
import SidebarServiceModule from '../../common/services/sidebar.service/sidebar.service';
import ngClickOutside from 'angular-click-outside';
import 'angular-hotkeys';

let contactsModule = angular.module('contacts', [
    uiRouter, coreModule.name, contactsContacts.name, SidebarServiceModule.name, 'tw.directives.clickOutside'
])

.config(defaultContactState)

.run(appRun)

.directive('contacts', contactsComponent);

defaultContactState.$inject = ['$urlRouterProvider'];
/* @ngInject */

function defaultContactState( $urlRouterProvider ){
    $urlRouterProvider.when('/contacts', '/contacts/list');
}

appRun.$inject = ['routerHelper'];
/* @ngInject */

function appRun( routerHelper ) {
    "ngInject";
    routerHelper.configureStates(getStates());
}

function getStates() {
    return [
        {
            state: 'contacts',
            config: {
                url: '/contacts',
                template: '<contacts></contacts>',
                title: 'Contacts',
                settings: {
                    nav: 1,
                    content: 'Contacts',
                    tooltip: 'Go to Contacts',
                    icon: 'account_circle'
                }
            }
        }
    ];
}
export default contactsModule;
