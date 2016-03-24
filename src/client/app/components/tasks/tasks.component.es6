import template from './tasks.html';
import controller from './tasks.controller';

let tasksComponent = function () {
    return {
        restrict: 'E',
        scope: {},
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default tasksComponent;
