import taskComposeTemplate from '../task.compose/task.compose.html'
import taskDeleteTemplate from '../task.delete/task.delete.html';
import mailComposeTemplate from '../../mail/mail.compose/mail.compose.html';
import createFolderTemplate from '../../../common/sidebar/sidebar.folders/create.new.folder/create.new.folder.html';
import createNewTagTemplate from '../../../common/tag/create.new.tag/create.new.tag.html';
import taskMoveTemplate from '../task.move/task.move.html';

class TasksTasksController {
	/*@ngInject*/

	constructor( logger, auth, $state, $scope, AUTH_EVENTS, config, mailService, moment, handleTaskService,
               taskOperationsService, tagService, $mdDialog, vncConstant, $rootScope) {

		let vm = this;
		vm.title = 'Tasks List';
		vm.saveTaskDetail = {};
		vm.selectedTasks = [];
		vm.isDisabled=false;
		vm.offset = 0;
		vm.query = '';
		vm.queryForFilter="";
		vm.selectedTaskIdForOperations = [];
		vm.allowableTaskStatus = '';
		vm.markAsCompletedButton = true;
		vm.listGroupLabel = {
			"past" : "Past Due",
			"today": "Today",
			"upcoming" : "Upcoming",
			"noDueDate" : "No Due Date"
		};
		vm.blankResponse = false;
		vm.loading = true;
		vm.taskList={
			past:[],
			today:[],
			upcoming:[],
			noDueDate:[]
		};
    handleTaskService.removeTaskList();

    //due date initialize data
    vm.sdate = 'dueDate';
    vm.reverse = true;
    vm.reverseIcon  = 'arrow_drop_down';

    //services
    vm.ws = new WebSocket(config.SITE_WS);
    vm.auth = auth;
    vm.moment = moment;
    vm.logger = logger;
    vm.$state = $state;
    vm.mailService = mailService;
    vm.tagService = tagService;
    vm.$mdDialog = $mdDialog;
    vm.$rootScope = $rootScope;
    vm.taskOperationsService = taskOperationsService;
    vm.handleTaskService = handleTaskService;

    // templates
		vm.taskComposeTemplate = taskComposeTemplate;
		vm.taskDeleteTemplate = taskDeleteTemplate;
		vm.taskMoveTemplate = taskMoveTemplate;
    vm.taskComposeTemplate = taskComposeTemplate ;
    vm.createFolderTemplate = createFolderTemplate ;
    vm.createNewTagTemplate = createNewTagTemplate ;


    if ($state.current.id == vncConstant.FOLDERID.TASKS) {
      vm.detailUrl = "tasks";
      vm.queryForFilter = 'in:tasks';
    }
    if ($state.current.id == vncConstant.FOLDERID.TRASH) {
      vm.detailUrl = "trashTasks";
      vm.queryForFilter = 'in:trash';
    }

    vm.getTaskListFromService();

    ///////////////////////////////   Listening Events   ////////////////////////////////////////////////////
		$scope.$on(AUTH_EVENTS.loginSuccess, (event, msg) => {
			vm.auth = auth;
			vm.ws.send(vm.auth.user.name + ' logged in');
		});

    $scope.$on("CallmarkAsCompleted", function(event, taskId){
      vm.markAsCompleted(taskId);
    });

    // update tags in message
    $scope.$on('event:task-tag-updated', function(e, tag, cond, key, id){
      if(cond == 'add') vm.handleTaskService.updateSingleTaskTag(key, id, tag);
      else if(cond == 'remove') vm.handleTaskService.removeSingleTaskTag(key, id, tag);
      else vm.taskDetailList[0].tags = [];
    });

    $scope.$on('search', function(e, search){
      vm.taskOperationsService.removeAllTaskOperations();
      vm.loading = true;
      vm.blankResponse = false;
      vm.query = search;
      vm.$state.go('tasks.'+ vm.detailUrl+'.detail',{'taskInvId' :  undefined});
      vm.getTaskListFromService();
    });
    ///////////////////////////////   Listening Events   ////////////////////////////////////////////////////

	}

  getTaskListFromService(){
    let vm = this;
    vm.loading = true;
    vm.taskList.past = [];
    vm.taskList.upcoming = [];
    vm.taskList.today = [];
    vm.taskList.noDueDate = [];

    let request={
      limit:100,
      query: vm.queryForFilter
    };
    vm.query != '' && (request.query = vm.query + ' ' + vm.queryForFilter);
    vm.allowableTaskStatus != '' && (request.allowableTaskStatus = vm.allowableTaskStatus);
    vm.mailService.getTasks(request, function(response){
      vm.loading = false;
      if(response && response.length){
        vm.handleTaskService.normalizeTask(response, function(){
          vm.taskList = vm.handleTaskService.taskList;
          vm.getTasksList = true;

          let pastTask = vm.taskList.past.length || 0;
          let upcomingTask =	vm.taskList.upcoming.length || 0;
          let todayTask = vm.taskList.today.length || 0;
          let noDueTask = vm.taskList.noDueDate.length || 0;
          vm.taskOffset = pastTask + todayTask + upcomingTask + noDueTask;
          //vm.taskOffset == 0 ? vm.isDisabled = true: vm.isDisabled=false;
        });
      }
      else vm.blankResponse = true;
    })
  };

  ///////////////////////////////   Selecting task   ////////////////////////////////////////////////////
  selectTask( id, taskId, key){
    let vm = this;
    vm.handleTaskService.setSelectedKey(key);
    vm.$state.go('tasks.'+ vm.detailUrl+'.detail',{'taskInvId' :  id});
    angular.forEach(vm.taskList, function ( value ) {
      angular.forEach(value, function ( task ) {
        task.selected = task.taskId == taskId;
      });
    });
    //vm.taskOperationsService.setTaskOperations(vm.$state.current.id, vm.multiSelectedTask, vm.selectedTaskIdForOperations);
  };
  ///////////////////////////////   Selecting task   ////////////////////////////////////////////////////

  ///////////////////////////////   Marking task   ////////////////////////////////////////////////////
  markAll(multiSelect){
    let vm = this;
    vm.selectedTasks = [];
    angular.forEach(vm.taskList, function ( value ) {
      angular.forEach(value, function ( task ) {
        task.checked = multiSelect;
        multiSelect && vm.selectedTasks.push( task.taskInvId );
      });
    });
    vm.taskOperationsService.setTaskOperations( vm.$state.current.id, vm.selectedTasks );
  };

  markMultiple( invID, value ){
    let vm = this;
    if( vm.selectedTasks && vm.selectedTasks.includes(invID) ){
      value || vm.selectedTasks.splice( vm.selectedTasks.indexOf(invID) , 1)
    }
    else{
      value && vm.selectedTasks.push( invID );
    }

    vm.taskOperationsService.setTaskOperations( vm.$state.current.id, vm.selectedTasks );
  };

  //called when any task status has to change to completed
  markAsCompleted(selectedTaskIds, key){
    let vm = this;
    vm.selectedStatus = {type:'', value:''};
    vm.selectedPriority = {type:'', value:''};
    vm.selectedProgress = {type:'', value:''};
    vm.taskNgModalDataList = [];
    vm.newAttachments = [];
    vm.movetoCompleted = [];
    var priority;
    let operation = "markAsCompleted";

    //Initialize the data
    vm.handleTaskService.initializeTaskForm(selectedTaskIds, vm.mailService, operation, vm.moment, function(res){
      let response = res;
      vm.newAttachments = response[0].attachment;
      if (response[0].priority === "High") {
        priority = '1';
      }
      if (response[0].priority === "Normal") {
        priority = '5';
      }
      if (response[0].priority === "Low") {
        priority = '9';
      }

      vm.taskNgModalDataList.push({
        "name" : response[0].name,
        "status" : response[0].statusValue,
        "priority" : priority,
        "progress" : response[0].progressValue,
        "location" : response[0].location
      });

      vm.taskNgModalDataList[0]["id"] = selectedTaskIds[0];
      //checks for start date
      if (response[0].startDate) {
        vm.taskNgModalDataList[0]["s"] = {"startDate" : vm.moment(response[0].startDate, 'YYYYMMDD')};
      }
      //checks for end date
      if (response[0].endDate) {
        vm.taskNgModalDataList[0]["d"] = {"dueDate" : vm.moment(response[0].endDate, 'YYYYMMDD')};
      }
      //checks for description
      if (angular.isDefined(response[0].description)) {
        vm.taskNgModalDataList[0]["des"] = {"description" :response[0].description};
      }

      //Generates the final request for Modified
      vm.handleTaskService._generateTaskRequest(vm.taskNgModalDataList,operation, function(res){
        let	request = res;
        if (vm.newAttachments.length > 0) {
          if (!request.attach) {
            request.attach = {};
            request.attach.mp = [];
          }
          for(let attachment of vm.newAttachments) {
            if(attachment.mid){
              request.attach.mp.push({
                mid : attachment.mid,
                part : attachment.part
              });
            }
          }
        }
        //calls modify task service
        vm.handleTaskService.modifyTask(request, vm.mailService, function(response){
          if(response){
            vm.handleTaskService.updateSingleTask(key, selectedTaskIds[0], {
              percentComplete: 100,
              status: 'COMP'
            });
            vm.$rootScope.$broadcast('event:task-mark-as-completed',selectedTaskIds[0]);
          }
        }); //End of modifyTask Service
      }); //End of _generateTaskRequest Service
    });	// End of initializeTaskForm Service
  };
  ///////////////////////////////   Marking task   ////////////////////////////////////////////////////


  ///////////////////////////////   Taging task   ////////////////////////////////////////////////////
  addRemoveTags(cond, tag){
    let vm = this,
      tasks = vm.selectedTasks.join(",");
    switch( cond ){
      case 'tag': {
        vm.mailService.assignTagToTask(tasks, tag.$.name, (res, err) => {
          if (err) {
            vm.logger.error(err.msg);
          }
          else {
            vm.handleTaskService.removeSelectedTaskTag(cond == 'tag', tag, vm.selectedTasks);
            // vm.logger.success( count+' Task tagged "' + tag.$.name + '"');
          }
        });
        break;
      }
      case 'remove-tag': {
        vm.mailService.removeAllTagFromAppointment(tasks, (res, err) => {
          if (err) {
            vm.logger.error(err.msg);
          }
          else {
            vm.handleTaskService.removeSelectedTaskTag(cond == 'tag', tag, vm.selectedTasks);
            // vm.logger.success('All Tags removed successfully.');
          }
        });
        break;
      }
    }
  };

  tagTask(task, key, id){
    let vm = this;
    vm.$mdDialog.show({
      controller: 'CreateNewTagController',
      controllerAs: 'vm',
      bindToController: true,
      template: createNewTagTemplate,
      escapeToClose: false,
      fullscreen: true
    })
      .then((res) => {
        vm.tagService.tagTask(task, res.tag, key, id, false);
      });
  };
  ///////////////////////////////   Taging task   ////////////////////////////////////////////////////

  ///////////////////////////////   Filter task   ////////////////////////////////////////////////////
  sortDateOrder(sdate){
    this.reverse = (this.sdate === sdate) ? !this.reverse : false;
    this.reverseIcon = this.reverse ? 'arrow_drop_down' : 'arrow_drop_up';
    this.sdate = sdate;
  };
  ///////////////////////////////   Filter task   ////////////////////////////////////////////////////

}
export default TasksTasksController;
