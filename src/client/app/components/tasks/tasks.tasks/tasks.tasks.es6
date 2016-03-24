import angular from 'angular';
import uiRouter from 'angular-ui-router';
import tasksTasksComponent from './tasks.tasks.component';
import tasksDetailModule from './tasks.tasks.detail/tasks.tasks.detail';
import TaskComposeController from '../task.compose/task.compose.controller';
import handleTaskService from './tasks.handleTask.service';
import coreModule from '../../../common/core/core';
import TaskDeleteController from '../task.delete/task.delete.controller';
import CreateNewTagController from '../../../common/tag/create.new.tag/create.new.tag.controller';
import TaskMoveController from '../task.move/task.move.controller';

import '../task.compose/_task.compose.scss';


let tasksTasksModule = angular.module('tasks.tasks', [
    uiRouter, tasksDetailModule.name, coreModule.name
])

.run(appRun)
.controller('TaskComposeController', TaskComposeController)
.controller('TaskDeleteController',TaskDeleteController)
.controller('CreateNewTagController',CreateNewTagController)
.controller('TaskMoveController',TaskMoveController)
.service('handleTaskService', handleTaskService)
.service('taskOperationsService', function() {
  let taskOperations = {};
  return {
    getTaskOperations : function () {
      return taskOperations;
    },
    setTaskOperations : function(folderId,value,id) {
        taskOperations = {"taskFolder": folderId, "taskId" : value};
    },
    removeAllTaskOperations : function() {
      taskOperations = {};
    }
  }
})

.directive('tasksTasks', tasksTasksComponent);

appRun.$inject = ['routerHelper'];
/* @ngInject */

function appRun( routerHelper ) {
    "ngInject";
    routerHelper.configureStates(getStates());
}

function getStates() {
    return [
        {
            state: 'tasks.tasks',
            config: {
                url: '/list',
                id:'15',
                template: '<tasks-tasks></tasks-tasks>',
                title: 'Tasks',
                settings: {
                    nav: 2,
                    content: 'Tasks',
                    icon: '../images/ic_move_to_inbox_black_24px.svg'
                }
            }
        },
        {
            state: 'tasks.trashTasks',
            config: {
                url: '/trash',
                id:'3',
                template: '<tasks-tasks></tasks-tasks>',
                title: 'Trash',
                settings: {
                    nav: 2,
                    content: 'Trash'
                }
            }
        }
    ];
}
export default tasksTasksModule;
