import template from './tasks.tasks.html';
import controller from './tasks.tasks.controller';
import './_tasks.tasks.scss';
import '../task.compose/_task.compose.scss';

let tasksTasksComponent = () => {
    return {
        restrict: 'E',
        scope: {},
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default tasksTasksComponent;
