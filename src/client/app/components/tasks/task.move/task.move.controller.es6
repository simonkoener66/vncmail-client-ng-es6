class TaskMoveController {
    /* @ngInject */
    constructor( $state, $mdDialog, handleTaskService, mailService, vncConstant, logger, taskOperationsService, sidebarFoldersService, data ) {

      let vm = this;
      vm.$mdDialog = $mdDialog;
      vm.logger = logger;
      vm.$state = $state;
      vm.mailService = mailService;
      vm.handleTaskService = handleTaskService;
      vm.vncConstant = vncConstant;
      vm.sidebarFoldersService = sidebarFoldersService;
      vm.moveTaskAttributes = taskOperationsService.getTaskOperations();
      vm.taskDetail = (typeof data == 'string') ? JSON.parse(data) : data;
      vm.SystemFolders={
        folder:[{
          "id":vncConstant.FOLDERID.TASKS,
          "name":"Tasks"
        },{
          "id":vncConstant.FOLDERID.TRASH,
          "name":"Trash"
        }]
      };
    };

  moveTask(){
    let vm = this,
        id = angular.equals({}, vm.taskDetail) ? vm.moveTaskAttributes.taskId.toString() : vm.taskDetail.taskId,
        count = angular.equals({}, vm.taskDetail) ? vm.moveTaskAttributes.taskId.length : 1;

    if (vm.selectedFolderId == vm.$state.current.id) {
      vm.sidebarFoldersService._openCriticalErrorModel('You cannot move items to the selected destination folder.');
    }
    else if (vm.selectedFolderId === vm.vncConstant.FOLDERID.TRASH){
      vm.mailService.moveTaskToTrash(id, function(res){
       if(res){
         angular.equals({}, vm.taskDetail) || vm.handleTaskService.removeSingleTask(vm.taskDetail.key, vm.taskDetail.taskId);
         angular.equals({}, vm.taskDetail) && vm.handleTaskService.removeSelectedTasks(vm.moveTaskAttributes.taskId);
         vm.logger.success(`${count} task moved to ${vm.selectedFolderName}`);
       }
        else vm.logger.error(err.msg);
         vm.$mdDialog.hide();
      });
    }
    else if (vm.selectedFolderId === vm.vncConstant.FOLDERID.TASKS){
      vm.mailService.moveTaskToFolder(id, vm.selectedFolderId, function(res, err){
        if(res){
          angular.equals({}, vm.taskDetail) || vm.handleTaskService.removeSingleTask(vm.taskDetail.key, vm.taskDetail.taskId);
          angular.equals({}, vm.taskDetail) && vm.handleTaskService.removeSelectedTasks(vm.moveTaskAttributes.taskId);
          vm.logger.success(`${count} task moved to ${vm.selectedFolderName}`);
        }
        else vm.logger.error(err.msg);
          vm.$mdDialog.hide();
      });
    }
  };

  cancel(){
    this.$mdDialog.hide();
  };
}

export default TaskMoveController;
