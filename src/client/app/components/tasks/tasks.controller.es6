class TasksController {
    /* @ngInject */
    constructor( logger ) {
        var vm = this;
        vm.title = 'Tasks';

        activate();

        function activate() {
            // logger.info('Activated Tasks View');
        }
    }
}

export default TasksController;
