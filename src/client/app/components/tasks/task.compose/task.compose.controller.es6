const MDDIALOG = new WeakMap();
const ROOTSCOPE = new WeakMap();
const SCOPE = new WeakMap();

class TaskComposeController {
  /* @ngInject */
  constructor(logger, mailService, $state, moment, $mdDialog, $rootScope, $scope, data, handleTaskService, $stateParams, hotkeys) {
    var vm = this;
    vm.detailUrl = "tasks";
    vm.mailService = mailService;
    vm.logger = logger;
    vm.title = 'Task Compose';
      vm.newAttachments = [];
    vm.compCreateTask = [];
    vm.mpTaskDescription = [];
    vm.alarm = [];
    vm.taskNgModalDataList = [];
    vm.operation = typeof data == 'string' ? JSON.parse(data) : data;
    vm.dateErrorMessageFlag=false;
    const MDDIALOG = new WeakMap();
    SCOPE.set(this, $scope);
    MDDIALOG.set(this, $mdDialog);
    /* add hotkeys */
    hotkeys.add({
      combo: ['enter', 'space'],
      callback: function( ) {
      vm.modifyTask();
      vm.createNewTask($event);
      }
    });

    hotkeys.add({
      combo: ['ctrl+s'],
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function(event) {
        event.preventDefault();
        if(vm.operation.operation !='editTask'){
            vm.createNewTask(event);
        }else{
            vm.modifyTask();
        }
      }
    });

    hotkeys.add({
      combo: ['esc'],
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function(event) {
          vm.cancel();
      }
    });

    hotkeys.add({
      combo: ['ctrl+m'],
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function( ) {
        angular.element('#fileAttachmentId').trigger('click');
      }
    });

    hotkeys.add({
      combo: ['ctrl+x'],
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function(event) {
        event.preventDefault();
        $('body').attr("spellcheck",true);
      }
    });

    vm.init = () => {
      vm.keyPress = false;
      vm.selectedPriority = {
        type : 'High',
        icon: 'vertical_align_top',
        value : '1'
      };
      vm.selectedStatus = {
        type : 'Not Started',
        value : 'NEED'
      };
      vm.selectedProgress = {
        type : '0%',
        value : '0'
      };
      vm.saveTaskDetail = {
        progresses : [],
        priority : [ { icon: 'vertical_align_top', type : 'High', value : '1' },
                     { icon: 'remove', type : 'Normal', value : '5'},
                     { icon: 'vertical_align_bottom', type : 'Low', value : '9' } ],
        status : [ { type : 'Not Started', value : 'NEED' },
                   { type : 'Completed', value : 'COMP' },
                   { type : 'In Progress', value : 'INPR' },
                   { type : 'Waiting on someone else', value : 'WAITING' },
                   { type : 'Deferred', value : 'DEFERRED' },
                   { type : 'All', value : 'All' } ],
        //reminderStartDate : new Date(),
        //reminderTime : new Date()
      };

      //To fill data for the progresses
      for(var i=0;i<=100;i+=10){
        vm.saveTaskDetail.progresses.push({type:i + "%",value:i})
      }
    };

    vm.init();

    //To set the default dates of reminder
    vm.setReminderOn = () =>{
        vm.saveTaskDetail.reminderStartDate = new Date();
        vm.saveTaskDetail.reminderTime = new Date;
    };

    $scope.$on('CLOSE_TASK_COMPOSE', (e, data) => {
      vm._closeModal();
    });

    vm._closeModal = () => {
      if ( this.firstOpen ) {
        MDDIALOG.get(this).hide().then(() => {
            console.info('close');
            // TODO This is a hack job until the issue of nested modals gets fixed.
            setTimeout(() => {
                let mask = document.querySelector('.md-scroll-mask');
                let dialog = document.querySelector('.md-dialog-container');
                let backdrop = document.querySelector('.md-dialog-backdrop');
                let body = document.querySelector('body');

                if(mask) {
                  mask.parentNode.removeChild(mask);
                }
                if(dialog) {
                  dialog.parentNode.removeChild(dialog);
                }
                if(dialog) {
                  backdrop.parentNode.removeChild(backdrop);
                }

                body.classList.remove('md-dialog-is-showing');
                this.firstOpen = false;
            }, 250);
        }, 'finished');
      }

    };

    //It will ask to user whether to save or cancel or close the create task.
    vm.cancel = () => {
      if(SCOPE.get(this).taskCompose.$dirty){
          MDDIALOG.get(this).show({
              controller: ['$rootScope', '$scope', '$mdDialog', this._savingTaskModalController],
              templateUrl: 'savingTaskModal.html',
              escapeToClose: false,
              fullscreen: true
            })
              .then((response) => {
              if (response == true) {
                if(vm.operation.operation === 'editTask'){ vm.modifyTask()}
                else vm.createNewTask();
              }
              if (response == false) {
                $mdDialog.cancel();
              }
            });
          }
      else{
             $mdDialog.cancel();
          }
    };

    //Managing flag of the keypress for Subject
    vm.keypressbackground = ($event) => {
      vm.keyPress = true;
    };

    //To set the status according to the Id for Not Started, Completed , ... etc.
    vm.OnStatusClick = (idx) => {
      if(idx == 1)
      {
        vm.selectedProgress = vm.saveTaskDetail.progresses[10];
      }
      if(idx == 2)
      {
        vm.selectedProgress = vm.saveTaskDetail.progresses[0];
      }
      if(idx == 0)
      {
        vm.selectedProgress = vm.saveTaskDetail.progresses[0];
      }
    };

    //To set the Progress according to the Id for 10, 20 , ... etc.
    vm.OnProgressClick = (idx) => {
        if(idx == 10)
        {
          vm.selectedStatus = vm.saveTaskDetail.status[1];
        }
        if(idx > 0 && idx < 10)
        {
          vm.selectedStatus = vm.saveTaskDetail.status[2];
        }
        if(idx == 0)
        {
          vm.selectedStatus = vm.saveTaskDetail.status[0];
        }
    };


    //This function is to handle the new task data as well as edit task data
    vm.handleTaskRequest = () => {
      vm.taskNgModalDataList.push({
      "name" : vm.saveTaskDetail.subject,
      "status" : vm.selectedStatus.value,
      "priority" : vm.selectedPriority.value,
      "progress" : vm.selectedProgress.value,
      "location" : vm.saveTaskDetail.location
    });

    if(vm.operation.operation === 'editTask' || (angular.isObject(vm.operation) && vm.operation.operation === 'editTask') ){
      vm.taskNgModalDataList[0]["id"] = $stateParams.taskInvId
    }
      //checks for start date is set and due date isnot saved
      if (angular.isDefined(vm.saveTaskDetail.startDate) && !angular.isDefined(vm.saveTaskDetail.dueDate)) {

        vm.dateErrorMessageFlag= true;
        //check for startdate isnot set and due date is set
      }else if(!angular.isDefined(vm.saveTaskDetail.startDate) && angular.isDefined(vm.saveTaskDetail.dueDate)){
        //its ok u can save it
          var formattedDate = moment(vm.saveTaskDetail.dueDate).format('YYYYMMDD');
          vm.taskNgModalDataList[0]["d"] = {"dueDate" :formattedDate};
          //both are set
      }else if(angular.isDefined(vm.saveTaskDetail.startDate) && angular.isDefined(vm.saveTaskDetail.dueDate)){
          //chck sd and dd condition
          var formattedDueDate = moment(vm.saveTaskDetail.dueDate).format('YYYYMMDD');
          var formattedStartDate = moment(vm.saveTaskDetail.startDate).format('YYYYMMDD');
          if(formattedStartDate <= formattedDueDate){
            vm.taskNgModalDataList[0]["s"] = {"startDate" : formattedStartDate};
            vm.taskNgModalDataList[0]["d"] = {"dueDate" : formattedDueDate};
          }else if(formattedStartDate > formattedDueDate){
            vm.taskNgModalDataList[0]["s"] = {"startDate" : formattedDueDate};
            vm.taskNgModalDataList[0]["d"] = {"dueDate" : formattedDueDate};
            vm.saveTaskDetail.startDate = vm.saveTaskDetail.dueDate;
          }
      }
      //checks for description
      if (angular.isDefined(vm.saveTaskDetail.description)) {
          vm.taskNgModalDataList[0]["des"] = {"description" :vm.saveTaskDetail.description};
      }
      //checks whether reminder checkbox is checked or not
      if (vm.task_checkbox) {
        vm.taskNgModalDataList[0]["rem"] = {"reminderdate" : vm.saveTaskDetail.reminderStartDate};
      }

      handleTaskService._generateTaskRequest(vm.taskNgModalDataList, vm.operation.operation, function(response){
        if(response){
          vm.taskRequest = response;
          vm._prepareAttachmentRequest(vm.taskRequest, vm.operation.operation);
        }
      });
    }; // End of handleTaskRequest function

    //To create a new Task
    vm.createNewTask = (event) => {
      console.log(vm.dateErrorMessageFlag + "dateErrorMessageFlag-----------");
      if(angular.isDefined(vm.saveTaskDetail.subject)){
      //  console.log(angular.isDefined(vm.saveTaskDetail.subject));
      if(angular.isDefined(vm.saveTaskDetail.startDate)){
        vm.saveTaskDetail.reminderTime = moment(vm.saveTaskDetail.reminderTime).format('HH:MM');
        if(angular.isDefined(vm.saveTaskDetail.dueDate)){
          vm.handleTaskRequest();
            handleTaskService.createTask(vm.taskRequest, mailService, function(response){
              if(response){
                // logger.info("New Task created.");
                handleTaskService.setTaskList({
                  taskName: vm.saveTaskDetail.subject,
                  percentComplete: vm.selectedProgress.value,
                  status: vm.selectedStatus.value,
                  dueDate: vm.saveTaskDetail.dueDate,
                  taskInvId: response.$.invId,
                  taskId: response.$.calItemId
                });
                $mdDialog.cancel();
              }
            });
        }else{
          $mdDialog.show(
           $mdDialog.alert()
             .parent(angular.element(document.querySelector('#popupContainer')))
             .clickOutsideToClose(true)
             .title('Critical! Kindly check again.')
             .textContent('Cannot save.You have errors that must be corrected :Due Date is required, when Start Date is specified.')
             .ariaLabel('Alert Dialog Demo')
             .ok('OK')
             .targetEvent()
         );
        }
      }

      }
      else if(!angular.isDefined(vm.saveTaskDetail.subject)){
    $mdDialog.show(
     $mdDialog.alert()
       .parent(angular.element(document.querySelector('#popupContainer')))
       .clickOutsideToClose(true)
       .title('Critical! Kindly check again.')
       .textContent('Cannot save.You have errors that must be corrected : Subject is a required field.')
       .ariaLabel('Alert Dialog Demo')
       .ok('OK')
       .targetEvent()
   );
 }
    };
    // End of Create New Task Function


    //This function is to populate the data when edit task is to be perform
    vm.initializeModifyForm = () => {
      let response = [];
      handleTaskService.initializeTaskForm($stateParams.taskInvId, mailService, vm.operation.operation, moment, function(res){
            response = res;
            vm.saveTaskDetail.subject = response[0].name;
            vm.selectedStatus.type = response[0].statusType;
            vm.selectedStatus.value = response[0].statusValue;
            vm.selectedPriority.type = response[0].priority;
            vm.selectedProgress.type = response[0].progressType;
            vm.selectedProgress.value = response[0].progressValue;
            vm.saveTaskDetail.location = response[0].location;
            if(response[0].startDate){
              vm.saveTaskDetail.startDate = new Date(response[0].startDate);
            }
            vm.newAttachments = response[0].attachment;

            if(response[0].endDate){
              vm.saveTaskDetail.dueDate = new Date(response[0].endDate);
            }
            if(response[0].description){
              vm.saveTaskDetail.description = response[0].description;
            }
      });
    };  //End of initializeModifyForm function

    //To check when to call above Function
    if(vm.operation.operation === 'editTask' || (angular.isObject(vm.operation) && vm.operation.operation === 'editTask') ){
      vm.initializeModifyForm();
    };


    //To modify the task
    vm.modifyTask = () => {
      vm.handleTaskRequest();
      let paramsID = $stateParams.taskInvId;
      $state.go('tasks.'+vm.detailUrl+'.detail',{'taskInvId' :  undefined});
      handleTaskService.modifyTask(vm.taskRequest, mailService, function(response){
          if(response){
            // logger.info("Task updated")
            handleTaskService.updateSingleTask(vm.operation.key, vm.operation.taskId, {
              taskName: vm.saveTaskDetail.subject,
              percentComplete: vm.selectedProgress.value,
              status: vm.selectedStatus.value,
              dueDate: vm.saveTaskDetail.dueDate
            });
            $mdDialog.cancel();
            $state.go('tasks.'+vm.detailUrl+'.detail',{'taskInvId' :  paramsID});
          }
        });
    }; //End of modifyTask function


    //Preparing Attachment for the create task
    vm._prepareAttachmentRequest = (request, operation) => {
      if(operation === 'compose'){
      // if there'll be new attachment(s)
      if (vm.newAttachments.length > 0) {
        if (!request.attach) {
          request.attach = {};
          request.attach.aid = '';
          request.attach.mp = [];
        }

        for(let attachment of vm.newAttachments) {
          request.attach.aid += attachment.aid + ',';
        }

        if (request.attach.aid.endsWith(',')) {
          request.attach.aid = request.attach.aid.substring(0, request.attach.aid.length - 1);
        }
      }
    } //End of operation compose
      if(operation !== 'compose'){
        // if there'll be new attachment(s)
        if (vm.newAttachments.length > 0) {
          if (!request.attach) {
            request.attach = {};
            request.attach.mp = [];
          }
          for(let attachment of vm.newAttachments) {
            if(attachment.aid){
              request.attach.aid = attachment.aid + ',';
            }

            if(attachment.mid){
              request.attach.mp.push({
                mid : attachment.mid,
                part : attachment.part
              });
            }
          }
          if(request.attach.aid){
          if (request.attach.aid.endsWith(',')) {
            request.attach.aid = request.attach.aid.substring(0, request.attach.aid.length - 1);
          }
        }
        }
      } //End of operation which is not compose
    }; //End of _prepareAttachmentRequest function
  } //End of controller

  //New controller for the new model
  _savingTaskModalController($rootScope, $scope, $mdDialog) {
    // creates New Task
    $scope.yes = () => {
      // passes the true value to create new task and closes the current modal
      $mdDialog.hide(true, $rootScope);
    };

    // passes the false value to close the root modal and closes the current modal
    $scope.no = () => {
      $mdDialog.hide(false);
    };

    // continue to create task
    $scope.cancel = () => {
      $mdDialog.cancel();
    };
  }
}
export default TaskComposeController;
