class moveFolderController {
  /* @ngInject */
  constructor( $scope, mailService, vncConstant, $rootScope, $mdDialog, data, logger, sidebarFoldersService, $filter, hotkeys ) {

    // initialization
    var vm = this;
    vm.folders = angular.copy(sidebarFoldersService.folders);
    vm.previousSelected = '';
    vm.currentFolder = (typeof data == 'string') ? JSON.parse(data) : data;
    vm.title = vm.currentFolder.type ? 'Move Conversation' : `Move Folder "${vm.currentFolder.$.name}"`;
    vm.treeFilter = $filter('uiTreeFilter');
    vm.reqPending = false;

    //service initialization
    vm.logger = logger;
    vm.$rootScope = $rootScope;
    vm.vncConstant = vncConstant;
    vm.mailService = mailService;
    vm.$mdDialog = $mdDialog;
    vm.sidebarFoldersService = sidebarFoldersService;

    // update folders
    $scope.$on('updateFolder', function(){
      vm.folders = angular.copy(sidebarFoldersService.folders);
    });

    vm.cancel = () => {
      this.$mdDialog.cancel();
    };

    vm.moveFolder = () =>{
      let vm = this;
      if(vm.currentFolder.$.l === vm.previousSelected.$.l &&
        angular.lowercase(vm.currentFolder.$.name) === angular.lowercase(vm.previousSelected.$.name)){
        vm.sidebarFoldersService._openCriticalErrorModel('You cannot move the folder to the selected destination folder.');
        return;
      }
      if(vm.currentFolder.$.l === vm.previousSelected.$.id){
        vm.sidebarFoldersService._openCriticalErrorModel('Cannot move folder to the selected destination folder. A folder with that name already exists under the destination folder.');
        return;
      }
      let request = {
        id: vm.currentFolder.$.id,
        l: vm.previousSelected.$.id
      };
      vm.mailService.moveFolder(request, function (res, err) {
        if (err) {
          vm.$mdDialog.hide();
          vm.logger.error(err.msg);
        }
        else {
          // vm.logger.success('folder "'+ vm.currentFolder.$.name +'" moved to "' + vm.previousSelected.$.name +'".');
          vm.$rootScope.$broadcast('folder-added');
          $mdDialog.hide();
        }
      });
    };
      /* add hotkeys */
    hotkeys.add({
      combo: ['enter', 'space'],
      callback: function( ) {
        vm.moveFolder();
      }
    });

    hotkeys.add({
      combo: ['esc'],
      callback: function( ) {
        vm.cancel();
      }
    });
  };

  selectFolder(folder){
    if(this.previousSelected) this.previousSelected.selected = false;
    this.previousSelected = folder;
    folder.selected = true;
  }

  createNewFolder(){
    this.currentFolder.isMoveFolder = true;
    this.sidebarFoldersService._openCreateNewFolderModal( this.currentFolder );
  };

  getColor(number){
    return number ? this.vncConstant.COLOR_CODES[number].toLowerCase() : 'yellow';
  };

  moveFolder(){
    let vm = this;
    if(vm.currentFolder.$.l === vm.previousSelected.$.l &&
      angular.lowercase(vm.currentFolder.$.name) === angular.lowercase(vm.previousSelected.$.name)){
      vm.reqPending = true;
      vm.sidebarFoldersService._openCriticalErrorModel('You cannot move the folder to the selected destination folder.', function(){
        vm.reqPending = false;
      });
    }
    else if(vm.currentFolder.$.l === vm.previousSelected.$.id){
      vm.reqPending = true;
      vm.sidebarFoldersService._openCriticalErrorModel('Cannot move folder to the selected destination folder. A folder with that name already exists under the destination folder.',
        function(){
        vm.reqPending = false;
      });
    }
    else{
      let request = {
        id: vm.currentFolder.$.id,
        l: vm.previousSelected.$.id
      };
      vm.mailService.moveFolder(request, function (res, err) {
        if (err) {
          let duplicateError = 'object with that name already exists';
          if(err.msg && err.msg.indexOf(duplicateError) > -1){
            vm.reqPending = true;
            vm.sidebarFoldersService._openCriticalErrorModel('Cannot move folder to the selected destination folder. A folder with that name already exists under the destination folder.',
              function(){
              vm.reqPending = false;
            });
          }
          else{
            vm.logger.error(err.msg);
            vm.$mdDialog.hide();
          }
        }
        else {
          // vm.logger.success('folder "'+ vm.currentFolder.$.name +'" moved to "' + vm.previousSelected.$.name +'".');
          vm.$rootScope.$broadcast('folder-added');
          vm.$mdDialog.hide();
        }
      });
    }
  };

  moveMail(){
    let vm = this;
    if(angular.isDefined(vm.currentFolder)) {
      if ( vm.currentFolder.type == 'Email' && vm.currentFolder.multiple ) {
        vm.mailService.moveEmail( vm.currentFolder.emailId, vm.previousSelected.$.id, function (res, err) {
          if (err) {
            vm.logger.error(err.msg);
          }
          else {
            vm.$rootScope.$broadcast("event:moveMultipleEvent",  vm.previousSelected.$.name );
            vm.$mdDialog.hide();
          }
        })
      }
      else if (vm.currentFolder.type == 'Email') {
        vm.mailService.moveEmail(vm.currentFolder.emailId, vm.previousSelected.$.id, function (res, err) {
          if (err) {
            vm.logger.error(err.msg);
          }
          else {
            // vm.logger.success('Email moved to "' + vm.previousSelected.$.name +'".');
            vm.$rootScope.$broadcast("event:moveEvent", vm.currentFolder.key, vm.currentFolder.index, vm.previousSelected);
            vm.$mdDialog.hide();
          }
        })
      }
      else if (vm.currentFolder.type == 'Message') {
        vm.mailService.moveMessage(vm.currentFolder.emailId, vm.previousSelected.$.id, function (res, err) {
          if (err) {
            vm.logger.error(err.msg);
          }
          else {
          // vm.logger.success('Message moved to "' + vm.previousSelected.$.name +'".');
            vm.$rootScope.$broadcast("event:moveMsgEvent", vm.currentFolder.index, vm.currentFolder.emailId, vm.previousSelected);
            vm.$mdDialog.cancel();
          }
        })
      }
    }
    vm.$mdDialog.cancel();
  };
}

export default moveFolderController;
