import angular from 'angular';
import uiRouter from 'angular-ui-router';
import mailTrashComponent from './mail.trash.component';

let mailTrashModule = angular.module('mail.trash', [
    uiRouter
])

/* @ngInject */
.run(appRun)

.directive('mailTrash', mailTrashComponent);

appRun.$inject = ['routerHelper'];
/* @ngInject */

function appRun( routerHelper ) {
    "ngInject";
    routerHelper.configureStates(getStates());
}

function getStates() {
    return [
        {
            state: 'mail.trash',
            config: {
                url: '/trash',
                template: '<mail-trash></mail-trash>',
                title: 'Trash',
                id: '3',
                settings: {
                    nav: 2,
                    folder: 3,
                    content: 'Trash',
                    icon: 'delete'
                }
            }
        }
    ];
}
export default mailTrashModule;
