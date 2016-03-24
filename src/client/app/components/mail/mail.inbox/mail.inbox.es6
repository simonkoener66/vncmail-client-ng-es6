import angular from 'angular';
import uiRouter from 'angular-ui-router';
import mailInboxComponent from './mail.inbox.component';

let mailInboxModule = angular.module('mail.inbox', [
    uiRouter
])

.run(appRun)

.directive('mailInbox', mailInboxComponent);

appRun.$inject = ['routerHelper'];
/* @ngInject */

function appRun( routerHelper ) {
    "ngInject";
    routerHelper.configureStates(getStates());
}

function getStates() {
    return [
        {
            state: 'mail.inbox',
            config: {
                url: '/inbox',
                template: '<mail-inbox></mail-inbox>',
                title: 'Inbox',
                id: '2',
                settings: {
                    nav: 2,
                    folder: 2,
                    content: 'Inbox',
                    icon: 'inbox'
                }
            }
        }
    ];
}
export default mailInboxModule;
