import angular from 'angular';
import uiRouter from 'angular-ui-router';
import tasksComponent from './tasks.component';
import coreModule from '../../common/core/core';
import tasksTasks from './tasks.tasks/tasks.tasks';
import 'angular-hotkeys';
let tasksModule = angular.module('tasks', [
    uiRouter, coreModule.name,tasksTasks.name
])
.config(defaultTaskState)

.run(appRun)

.directive('tasks', tasksComponent);

defaultTaskState.$inject = ['$urlRouterProvider'];
/* @ngInject */

appRun.$inject = ['routerHelper'];
/* @ngInject */

function appRun( routerHelper ) {
    "ngInject";
    routerHelper.configureStates(getStates());
}

function defaultTaskState( $urlRouterProvider ){
  "ngInject";
  $urlRouterProvider.when('/tasks', '/tasks/list');
}

function getStates() {
    return [
        {
            state: 'tasks',
            config: {
                url: '/tasks',
                template: '<tasks></tasks>',
                title: 'Tasks',
                settings: {
                    nav: 1,
                    content: 'Tasks',
                    tooltip: 'Go to Tasks',
                    icon: 'event_available'
                }
            }
        }
    ];
}
export default tasksModule;
