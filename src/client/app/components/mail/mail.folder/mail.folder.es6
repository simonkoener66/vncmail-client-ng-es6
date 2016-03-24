import angular from 'angular';
import uiRouter from 'angular-ui-router';
import mailFolderComponent from './mail.folder.component';

let mailFolderModule = angular.module('mail.folder', [
    uiRouter
])

.run(appRun)

.directive('mailFolder', mailFolderComponent);

appRun.$inject = ['routerHelper'];
/* @ngInject */

function appRun( routerHelper ) {
    "ngInject";
    routerHelper.configureStates(getStates());
}

function getStates() {
    return [
        {
            state: 'mail.folder',
            config: {
                url: '/folder/:name/:id',
                template: '<mail-folder></mail-folder>',
                title: 'Folder',
                settings: {
                    nav: 2,
                    content: 'folder',
                    icon: 'folder'
                }
            }
        }
    ];
}
export default mailFolderModule;
