class TaskDeleteController {
  /* @ngInject */
  constructor(logger, $mdDialog, $state, mailService, taskOperationsService, data, handleTaskService) {

    var vm = this;
    vm.$state = $state;
    vm.logger = logger;
    vm.mailService = mailService;
    vm.$mdDialog = $mdDialog;
    vm.handleTaskService = handleTaskService;
    vm.deleteTaskAttributes = taskOperationsService.getTaskOperations();
    vm.taskDetail = (typeof data == 'string') ? JSON.parse(data) : data;
  }

  //It will delete task from system folders and trash too
  deleteTask(){
    let vm = this,
      msg,
      request = {
      id: angular.equals({}, vm.taskDetail) ? vm.deleteTaskAttributes.taskId.toString() : vm.taskDetail.taskId
    };
    if(vm.$state.current.id !== '3'){
      request.op = "move";
      request.folderId = '3';
      msg = angular.equals({}, vm.taskDetail) ?  vm.deleteTaskAttributes.taskId.length + " tasks moved to Trash" : "1 task moved to Trash";
    }
    else{
      request.op = 'delete';
      msg = angular.equals({}, vm.taskDetail) ?  vm.deleteTaskAttributes.taskId.length + " tasks deleted" : "1 task deleted";
    }

    vm.mailService.deleteTask(request, function(res, err){
      if(res){
          angular.equals({}, vm.taskDetail) || vm.handleTaskService.removeSingleTask(vm.taskDetail.key, vm.taskDetail.taskId);
          angular.equals({}, vm.taskDetail) && vm.handleTaskService.removeSelectedTasks(vm.deleteTaskAttributes.taskId);
          vm.$mdDialog.hide();
          vm.logger.info(msg);
      }
    });
  };


  //It will dismiss the model while click on cancel
  cancel(){
  this.$mdDialog.hide()
};

}
export default TaskDeleteController;
