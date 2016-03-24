import angular from 'angular';
import uiRouter from 'angular-ui-router';
import mailJunkComponent from './mail.junk.component';

let mailJunkModule = angular.module('mail.junk', [
    uiRouter
])

.run(appRun)

.directive('mailJunk', mailJunkComponent);

appRun.$inject = ['routerHelper'];
/* @ngInject */

function appRun( routerHelper ) {
    "ngInject";
    routerHelper.configureStates(getStates());
}

function getStates() {
    return [
        {
            state: 'mail.junk',
            config: {
                url: '/junk',
                template: '<mail-junk></mail-junk>',
                title: 'Junk',
                id: '4',
                settings: {
                    nav: 2,
                    folder: 4,
                    content: 'Junk',
                    icon: 'delete'
                }
            }
        }
    ];
}
export default mailJunkModule;
