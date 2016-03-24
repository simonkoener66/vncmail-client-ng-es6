import angular from 'angular';
import uiRouter from 'angular-ui-router';
import contactsDistributionListDetailComponent from './contacts.distribution.list.detail.component';

let contactsDistributionListDetailModule = angular.module('contacts.distribution.list.detail', [
    uiRouter, 'contacts'
])

.run(appRun)

.directive('contactsDistributionListDetail', contactsDistributionListDetailComponent);

appRun.$inject = ['routerHelper'];
/* @ngInject */

function appRun( routerHelper ) {
    "ngInject";
    routerHelper.configureStates(getStates());
}

function getStates() {
    return [
        {
            state: 'contacts.distributionList.detail',
            config: {
                url: '/detail/:contactId',
                template: '<contacts-distribution-list-detail></contacts-distribution-list-detail>',
                title: 'Distribution Detail',
                settings: {
                    nav: 3,
                    content: 'Distribution Detail'
                }
            }
        }
    ];
}
export default contactsDistributionListDetailModule;
