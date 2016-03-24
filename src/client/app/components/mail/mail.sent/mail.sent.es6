import angular from 'angular';
import uiRouter from 'angular-ui-router';
import mailSentComponent from './mail.sent.component';

let mailSentModule = angular.module('mail.sent', [
    uiRouter
])

.run(appRun)

.directive('mailSent', mailSentComponent);

appRun.$inject = ['routerHelper'];
/* @ngInject */

function appRun( routerHelper ) {
    "ngInject";
    routerHelper.configureStates(getStates());
}

function getStates() {
    return [
        {
            state: 'mail.sent',
            config: {
                url: '/sent',
                template: '<mail-sent></mail-sent>',
                title: 'Sent',
                id: '5',
                settings: {
                    nav: 2,
                    folder: 5,
                    content: 'Sent',
                    icon: 'send'
                }
            }
        }
    ];
}
export default mailSentModule;
