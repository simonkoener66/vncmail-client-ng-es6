import angular from 'angular';
import uiRouter from 'angular-ui-router';
import tasksDetailComponent from './tasks.tasks.detail.component';

let tasksDetailModule = angular.module('tasks.tasks.detail', [
    uiRouter, 'tasks'
])

.run(appRun)

.directive('tasksTasksDetail', tasksDetailComponent);

appRun.$inject = ['routerHelper'];
/* @ngInject */

function appRun( routerHelper ) {
    "ngInject";
    routerHelper.configureStates(getStates());
}

function getStates() {
    return [
        {
            state: 'tasks.tasks.detail',
            config: {
                url: '/detail/:taskInvId',
                id: '15',
                template: '<tasks-tasks-detail></tasks-tasks-detail>',
                title: 'Detail',
                settings: {
                    nav: 3,
                    content: 'Task Detail'
                }
            }
        },
        {
            state: 'tasks.trashTasks.detail',
            config: {
                url: '/detail/:taskInvId',
                id: '3',
                template: '<tasks-tasks-detail></tasks-tasks-detail>',
                title: 'Detail',
                settings: {
                    nav: 3,
                    content: 'Task Detail'
                }
            }
        }
    ];
}
export default tasksDetailModule;
