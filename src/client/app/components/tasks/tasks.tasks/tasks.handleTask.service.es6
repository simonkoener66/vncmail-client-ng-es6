let handleTaskService = function( mailService, tagService, logger, $state, vncConstant, $rootScope ){
    let vm = this;
    let taskId = [];
    vm.taskDetails = [];
    let markAsCompleted = [];
    let taskInitializeData = [];
    let selectedKey = '';
  vm.taskList={
      past:[],
      today:[],
      upcoming:[],
      noDueDate:[]
    };

  this.removeTaskList = () => {
    vm.taskList={
      past:[],
      today:[],
      upcoming:[],
      noDueDate:[]
    }
  };

  this.getSelectedKey = () => {
    return selectedKey;
  };

  this.setSelectedKey = (key) => {
    selectedKey = key;
  };

  this.updateSingleTask = (key, id, options) => {
    for(let i = 0; i < vm.taskList[key].length; i++){
      if(vm.taskList[key][i].taskInvId == id) {
        vm.taskList[key][i] = angular.extend(vm.taskList[key][i], options);
        return;
      }
    }
  };

  this.updateSingleTaskTag = (key, id, tag) => {
    for(let i = 0; i < vm.taskList[key].length; i++){
      if(vm.taskList[key][i].taskInvId == id) {
        vm.taskList[key][i].tags.push(tag);
        return;
      }
    }
  };

  this.removeSingleTaskTag = (key, id, tag) => {
    for(let i = 0; i < vm.taskList[key].length; i++){
      if(vm.taskList[key][i].taskInvId == id) {
        let tags = vm.taskList[key][i].tags.map(function(x){return x.$.id});
        vm.taskList[key][i].tags.splice(tags.indexOf(tag.$.id), 1);
        return;
      }
    }
  };

  this.removeSelectedTaskTag = (flag, tag, selectedTasks) => {
    for(let i in vm.taskList){
      for(let j = 0; j < vm.taskList[i].length; j++){
        if( selectedTasks.includes(vm.taskList[i][j].taskInvId) && flag) {
          if(!(vm.taskList[i][j].tags.map(function(x){ return x.$.id}).includes(tag.$.id))){
            vm.taskList[i][j].tags.push(tag);
            $state.params.taskInvId == vm.taskList[i][j].taskInvId && $rootScope.$broadcast('event:task-detail-tag-updated', tag, 'add')
          }
        }
        else if(selectedTasks.includes(vm.taskList[i][j].taskInvId) && !flag) {
          vm.taskList[i][j].tags = [];
          $state.params.taskInvId == vm.taskList[i][j].taskInvId && $rootScope.$broadcast('event:task-detail-tag-updated', undefined, 'all')
        }
      }
    }
  };

  this.removeSingleTask = (key, id) => {
    this.isSelectedTask([id]);
    for(let i = 0; i < vm.taskList[key].length; i++){
      if(vm.taskList[key][i].taskInvId == id) {
        vm.taskList[key].splice(i, 1);
        return;
      }
    }
  };

  this.removeSelectedTasks = (ids) => {
    this.isSelectedTask(ids);
    angular.forEach(vm.taskList, function ( value , key) {
      vm.taskList[key] = value.filter(function(task){
        if(!ids.includes(task.taskInvId)) return task;
      });
    });
  };

  this.isSelectedTask = function(ids){
    let detailUrl = 'tasks';
    if ($state.current.id == vncConstant.FOLDERID.TASKS) {
      detailUrl = "tasks";
    }
    if ($state.current.id == vncConstant.FOLDERID.TRASH) {
      detailUrl = "trashTasks";
    }
    ids.includes($state.params.taskInvId) && $state.go('tasks.'+ detailUrl +'.detail',{'taskInvId' :  undefined});
  };

  this.setTaskList = ( list ) => {
    let currentDate = new Date().setHours(0,0,0,0);

    if(list.dueDate){
      var taskDate = new Date(list.dueDate).setHours(0,0,0,0);
      //past
      if((taskDate - currentDate) < 0 ){
        vm.taskList.past.push(list);
        //upcoming
      }else if((taskDate - currentDate) > 0){
        vm.taskList.upcoming.push(list);
        //today
      }else if((taskDate - currentDate) == 0){
        vm.taskList.today.push(list);
      }
      //noDueDate:
    }else{
      vm.taskList.noDueDate.push(list);
    }

  };

  this.normalizeTask = (response, cb) => {
    vm.taskList={
      past:[],
      today:[],
      upcoming:[],
      noDueDate:[]
    };

    for(let i in response){
      let list = {};
      if(response[i].inst){
        list.dueDate = new Date(parseInt(response[i].inst.$.dueDate));
      }
      if(response[i].$){
        list.taskName = response[i].$.name ;
        list.priority = response[i].$.priority ;
        list.taskInvId = response[i].$.invId;
        list.percentComplete = response[i].$.percentComplete ;
        list.status = response[i].$.status;
        list.tags = tagService._splitTags(response[i].$.tn) || [];
        list.attachmentFlag = response[i].$.f != undefined ?  response[i].$.f.indexOf("a") != -1 : false;
        list.taskId = response[i].$.id;
        list.selected = false;
        list.checked = false;
      }
      this.setTaskList(list);
    }
    cb && cb();
  };

    //Service for the task detail based on the task id
    this.getTaskDetails = (value, mailService, cb) => {
      taskId = value;
      mailService.getTaskById(taskId, function(response){
        vm.taskDetails = response;
        cb(vm.taskDetails)
      });
    }; //End of getTaskDetails function

    //Populates the form for edit Task
    this.initializeTaskForm = (taskInvId, mailService, operation, moment, cb) => {
      let priority, progressType, progressValue, statusType, statusValue, startDate, endDate, description;
      let attachments = [];
      taskInitializeData = [];
      mailService.getTaskById(taskId, function(response){
        vm.taskDetails = response;
      });
      if (vm.taskDetails.inv.comp.$.priority === "1") {
        priority = 'High';
      }
      if (vm.taskDetails.inv.comp.$.priority === "5") {
        priority = 'Normal';
      }
      if (vm.taskDetails.inv.comp.$.priority === "9") {
        priority = 'Low';
      }
      if(operation === 'editTask'){
      if (vm.taskDetails.inv.comp.$.status === "NEED") {
        statusType = 'Not Started';
        statusValue = vm.taskDetails.inv.comp.$.status;
      }
      if (vm.taskDetails.inv.comp.$.status === "COMP") {
        statusType = "Completed";
        statusValue = vm.taskDetails.inv.comp.$.status;
      }
      if (vm.taskDetails.inv.comp.$.status === "INPR") {
        statusType = 'In Progress';
        statusValue = vm.taskDetails.inv.comp.$.status;
      }
      if (vm.taskDetails.inv.comp.$.status === "WAITING") {
        statusType = 'Waiting on someone else';
        statusValue = vm.taskDetails.inv.comp.$.status;
      }
      if (vm.taskDetails.inv.comp.$.status === "DEFERRED") {
        statusType = 'Deferred';
        statusValue = vm.taskDetails.inv.comp.$.status;
      }
      if(vm.taskDetails.inv.comp.$.percentComplete){
        progressType = vm.taskDetails.inv.comp.$.percentComplete+"%";
        progressValue = vm.taskDetails.inv.comp.$.percentComplete;
      }
    }

    if(operation === 'markAsCompleted'){
      statusType = "Completed";
      statusValue = "COMP";
      progressType = "100%";
      progressValue = "100";
    }
      //checks for start date
      if (vm.taskDetails.inv.comp.s) {
        startDate = moment(vm.taskDetails.inv.comp.s.$.d, 'YYYYMMDD').format('ll');
      }
      //checks for end date
      if (vm.taskDetails.inv.comp.e) {
        endDate = moment(vm.taskDetails.inv.comp.e.$.d, 'YYYYMMDD').format('ll');
      }
      //checks for description
      if (vm.taskDetails.inv.comp.desc) {
        description = vm.taskDetails.inv.comp.desc;
      }

      //checks for Attachments
      if(vm.taskDetails.mp){
        for(let i =1;i <vm.taskDetails.mp.mp.length;i++){
          attachments.push({
            name: vm.taskDetails.mp.mp[i].$.filename,
            size : vm.taskDetails.mp.mp[i].$.s,
            part : vm.taskDetails.mp.mp[i].$.part,
            mid : vm.taskDetails.$.id
          });
        }
      }

      taskInitializeData.push({
        "name" : vm.taskDetails.inv.comp.$.name,
        "location" : vm.taskDetails.inv.comp.$.loc,
        "priority" : priority,
        "statusType" : statusType,
        "statusValue" : statusValue,
        "progressType" : progressType,
        "progressValue" : progressValue,
        "startDate" : startDate,
        "endDate" : endDate,
        "description" : description,
        "attachment" : attachments,

      });
      cb(taskInitializeData);
    }; //End of initializeTaskForm function

    //For the final task request
    this._generateTaskRequest = (taskNgModalDataList, operation, cb) => {
        let mpTaskDescription = [];
        let compCreateTask = [];
        let alarm = [];
        if(compCreateTask.length == 0){
			       compCreateTask.push({
				          "name" : taskNgModalDataList[0].name,
				          "status" : 	taskNgModalDataList[0].status,
				          "priority" : taskNgModalDataList[0].priority,
				          "percentComplete" :taskNgModalDataList[0].progress,
				          "loc" : taskNgModalDataList[0].location
		        });
		    }
			  //checks for start date
			  if (taskNgModalDataList[0].s) {
			   	compCreateTask[0]["s"] = {
				  	"d" : taskNgModalDataList[0].s.startDate
			  	 };
			  }
			  //checks for end date
			  if (taskNgModalDataList[0].d) {
				  compCreateTask[0]["e"] = {
					  "d" : taskNgModalDataList[0].d.dueDate
				  };
			  }
			  //checks for description
        if (angular.isDefined(taskNgModalDataList[0].des)) {
		      mpTaskDescription.push({
			        "ct" : "text/plain",
			        "content" : taskNgModalDataList[0].des.description
		      });
        }
			  //checks whether reminder checkbox is checked or not
        if(angular.isDefined(taskNgModalDataList[0].rem)){
				      var formattedTime = moment(taskNgModalDataList[0].rem.reminderdate).format('YYYYMMDDHHMMSS');
				          alarm.push({
					          "action": "DISPLAY",
					          "trigger": {
						        "abs": {
							        "d": "20151201T083000Z"
						          }
					          }
					       });
					   compCreateTask[0]["alarm"] = alarm;
			  }
        //checks if subject value is entered or not
        if (angular.isDefined(compCreateTask[0].name)) {
			  	 let request = {
				     l: 15,
					   inv: { comp : compCreateTask },
			  		 e: [],
				  	 su: compCreateTask[0].name,
					   mp: { mp : mpTaskDescription,  "ct": "multipart/alternative" }
				   };
           if(operation !== 'compose'){
             request.id = taskNgModalDataList[0].id;
           }
           cb(request);
         }else{
              logger.error("Please Enter the subject");
         }
       }; //End of _generateTaskRequest function

      //create a new task service call
      this.createTask = (request, mailService, cb) => {
         mailService.createTask(request, function(response){
          cb(response);
        });
      }; //End of createTask function

      //modify task service call
      this.modifyTask = (request, mailService, cb) => {
         mailService.modifyTask(request, function(response){
          cb(response);
         });
      }; //End of modifyTask function
};

handleTaskService.$inject = ['mailService', 'tagService', 'logger', '$state', 'vncConstant', '$rootScope'];
/*@ngInject*/

export default handleTaskService;
