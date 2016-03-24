import template from './tasks.tasks.detail.html';
import controller from './tasks.tasks.detail.controller';
import './_tasks.tasks.detail.scss';

let tasksDetailComponent = function () {
    return {
        restrict: 'E',
        scope: {},
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default tasksDetailComponent;
