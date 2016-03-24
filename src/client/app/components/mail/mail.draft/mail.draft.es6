import angular from 'angular';
import uiRouter from 'angular-ui-router';
import mailDraftComponent from './mail.draft.component';

let mailDraftModule = angular.module('mail.draft', [
    uiRouter
])

.run(appRun)

.directive('mailDraft', mailDraftComponent);

appRun.$inject = ['routerHelper'];
/* @ngInject */

function appRun( routerHelper ) {
    "ngInject";
    routerHelper.configureStates(getStates());
}

function getStates() {
    return [
        {
            state: 'mail.draft',
            config: {
                url: '/draft',
                template: '<mail-draft></mail-draft>',
                title: 'Drafts',
                settings: {
                    nav: 2,
                    folder: 6,
                    content: 'Drafts (2)',
                    icon: 'drafts'
                }
            }
        }
    ];
}
export default mailDraftModule;
