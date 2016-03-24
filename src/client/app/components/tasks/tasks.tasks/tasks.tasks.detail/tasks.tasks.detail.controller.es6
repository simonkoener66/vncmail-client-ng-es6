import TaskComposeController from '../../task.compose/task.compose.controller'
import taskComposeTemplate from '../../task.compose/task.compose.html'
import taskDeleteTemplate from  '../../task.delete/task.delete.html'
import createNewTagTemplate from '../../../../common/tag/create.new.tag/create.new.tag.html';
import createFolderTemplate from '../../../../common/sidebar/sidebar.folders/create.new.folder/create.new.folder.html';

class TaskDetailController {
    /*@ngInject*/
    constructor($stateParams, $window, $state, mailService, moment, $scope, $mdDialog, handleTaskService, $rootScope, tagService) {

        let vm = this;
        vm.WindowDetailHeight = {height: ((angular.element($window)[0].innerHeight - 132)+ 'px')};
        vm.selectedTaskId = $stateParams.taskInvId;
        vm.taskDetails = [];
        vm.attachments = [];
        vm.isSelectedTaskId = true;
        vm.taskComposeTemplate = taskComposeTemplate;
        vm.taskDeleteTemplate = taskDeleteTemplate;
        vm.createFolderTemplate = createFolderTemplate ;
        vm.$mdDialog = $mdDialog;
        vm.markAsCompletedTaskId = [];
        vm.markAsCompletedTaskId.push(vm.selectedTaskId);
		    vm.createNewTagTemplate = createNewTagTemplate ;
        vm.tagService = tagService;
        vm.taskDetailList = [];
        vm.key = handleTaskService.getSelectedKey();
        vm.window = $window;
        vm.$state = $state;
        this.mailService = mailService;
        vm.init = () => {
          if (angular.isDefined(vm.selectedTaskId) && vm.selectedTaskId != '') {
          handleTaskService.getTaskDetails(vm.selectedTaskId, mailService, function(response){
             if(angular.isDefined(response)){
                 vm.handleTaskDetail(response);
               }
          });
          }else {
              vm.isSelectedTaskId = false;
          }
        };

        $scope.markAsCompleted = function() {
         $rootScope.$emit("CallmarkAsCompleted", vm.markAsCompletedTaskId);
       };

        // update tags in taks detail
        $scope.$on('event:task-mark-as-completed', function(e, id){
          if(id == vm.taskDetailList[0].taskId){
            vm.taskDetailList[0].status = 'COMP';
            vm.status = 'Completed';
            vm.progress = 100;
          }
        });

        // update tags in taks detail
        $scope.$on('event:task-detail-tag-updated', function(e, tag, cond){
          if(cond == 'add') vm.taskDetailList[0].tags.push(tag);
          else if(cond == 'remove') {
            let tags = vm.taskDetailList[0].tags.map(function(x){return x.$.id});
            vm.taskDetailList[0].tags.splice(tags.indexOf(tag.$.id), 1);
          }
          else vm.taskDetailList[0].tags = [];
        });

      vm.setPriorityandStatus = (taskDetails) => {
          if (taskDetails.inv.comp.$.priority == "1") {
  					vm.priority = "High";
					}
          if (taskDetails.inv.comp.$.priority == "5") {
  					vm.priority = "Normal";
					}
          if (taskDetails.inv.comp.$.priority == "9") {
  					vm.priority = "Low";
					}
					if (taskDetails.inv.comp.$.status == "NEED") {
						vm.status = "Not Started";
					}
          if (taskDetails.inv.comp.$.status == "COMP") {
						vm.status = "Completed";
					}
          if (taskDetails.inv.comp.$.status == "INPR") {
						vm.status = "In Progress";
					}
          if (taskDetails.inv.comp.$.status == "WAITING") {
						vm.status = "Waiting on someone else";
					}
          if (taskDetails.inv.comp.$.status == "DEFERRED") {
						vm.status = "Deferred";
					}
        };

        vm.editTask = () => {
          vm.$mdDialog.show({
            controller: TaskComposeController,
            controllerAs: 'vm',
            bindToController: true,
            template: taskComposeTemplate,
            escapeToClose: false,
            fullscreen: true,
            resolve: {
              data: () => {
                return {"operation": "editTask", "taskId": vm.taskDetailList[0].taskId,"key": vm.key};
              }
            }
          });
        };

        vm.setDates = (taskDetails) => {
            if(taskDetails.inv.comp.e){
              vm.endDate = moment(taskDetails.inv.comp.e.$.d, 'YYYYMMDD').format('ll');
            }
            if(taskDetails.inv.comp.s){
              vm.startDate = moment(taskDetails.inv.comp.s.$.d, 'YYYYMMDD').format('ll');
            }
        };

        vm.attachmentsList = (taskDetails) => {
          if(taskDetails.mp){
            for(let i=1;i<taskDetails.mp.mp.length;i++){
              if(taskDetails.mp.mp[i].$.s > 1000 && taskDetails.mp.mp[i].$.s < 1000000){
                vm.size = (taskDetails.mp.mp[i].$.s/1000);
                vm.unit = 'KB';
              }else if(taskDetails.mp.mp[i].$.s > 1000000){
                vm.size = (taskDetails.mp.mp[i].$.s/1000000);
                vm.unit = 'MB';
              }else{
                vm.size = taskDetails.mp.mp[i].$.s;
                vm.unit = 'B';
              }
              vm.attachments.push({
                name: taskDetails.mp.mp[i].$.filename,
                size : vm.size,
                unit : vm.unit
              });
            }
          }
        };

        vm.handleTaskDetail = (response) => {
          vm.taskDetails = response;
          vm.subject = vm.taskDetails.inv.comp.$.name;
          vm.location = vm.taskDetails.inv.comp.$.loc;
          vm.setPriorityandStatus(vm.taskDetails);
          vm.progress = vm.taskDetails.inv.comp.$.percentComplete;
          vm.setDates(vm.taskDetails);
          vm.description = vm.taskDetails.inv.comp.desc;
          vm.attachmentsList(vm.taskDetails);
          var taskName= response.inv.comp.$.name ;
          var	priority=response.inv.comp.$.priority ;
          var taskInvId=response.inv.comp.$.calItemId ;
          var	percentComplete=response.inv.comp.$.percentComplete ;
          var status=response.inv.comp.$.status;
          var tags = vm.tagService._splitTags(response.$.tn) || [];
          var attachmentFlag=response.$.f != undefined ?  response.$.f.indexOf("a") != -1 : false;
          var taskId = response.$.id;
          var responseDate;
          if(response.$.d){
						responseDate=new Date(parseInt(response.$.d));
					}
          vm.taskDetailList.push({
            'taskName':taskName,
            'priority':priority,
            'percentComplete':percentComplete,
            'status':status,
            'dueDate':responseDate,
            'attachmentFlag':attachmentFlag,
            'taskInvId':taskInvId,
            'tags':tags,
            'selected':false,
            'taskId' : taskId
          });
        };

        vm.printTask = () => {
          if(angular.isDefined(vm.selectedTaskId)){
              var printTaskUrl = this.mailService.printTask(vm.selectedTaskId);
              var popupWin = this.window.open(printTaskUrl);
              popupWin.print();
          }else{
              console.log("Task id is required");
          }
        };

        vm.tagTask = (task, key, id) => {
          let vm = this;
          $mdDialog.show({
            controller: 'CreateNewTagController',
            controllerAs: 'vm',
            bindToController: true,
            template: createNewTagTemplate,
            escapeToClose: false,
            fullscreen: true
          })
            .then((res) => {
              vm.tagService.tagTask(task, res.tag, key, id, true);
              	$state.go("tasks");
            });
        };
        vm.init();
    }
}

export default TaskDetailController;
