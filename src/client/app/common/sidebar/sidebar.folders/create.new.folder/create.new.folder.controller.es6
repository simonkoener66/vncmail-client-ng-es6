class CreateNewFolderController {
  /* @ngInject */
  constructor( $scope, logger, $mdDialog, mailService, $rootScope, vncConstant, data, sidebarFoldersService, hotkeys) {

    // initialization
    var vm = this;
    vm.previousSelected = '';
    vm.parentFolder = 1; // default root if no parent selected
    vm.showRssField = false;
    vm.reqPending = false;
    vm.selectColor = '';
    vm.availableColors = vncConstant.COLOR_CODES;
    vm.availableColors[0] = 'default';
    vm.folders = angular.copy(sidebarFoldersService.folders);

    //services initialization
    vm.mailService = mailService;
    vm.$mdDialog = $mdDialog;
    vm.$rootScope = $rootScope;
    vm.vncConstant = vncConstant;
    vm.logger = logger;
    vm.sidebarFoldersService = sidebarFoldersService;

    vm.details = (typeof data == 'string') ? JSON.parse(data) : data;
    if(vm.details && vm.details.$ && !vm.details.isMoveFolder){
      vm.parentFolderName = vm.details.$.name;
      vm.parentId = vm.details.$.id;
    }

    $scope.$on('updateFolder', function(){
      vm.folders = angular.copy(sidebarFoldersService.folders);
    });
  //   vm.cancel = (event) => {
  //     alert("You pressed a key field");
  //     console.log(event.which === 27);
  //alert ("You pressed the Escape key!");
  //     vm.cancel = true;
  // };
    /* add hotkeys */
  hotkeys.add({
    combo: ['Enter', 'space'],
    callback: function( ) {
      vm.createFolder();
    }
  });
  hotkeys.add({
    combo: ['esc'],
    callback: function( ) {
      vm.cancel();
    }
  });

};
  selectFolderColor(color){
    this.selectColor = color;
  }

  selectFolder(folder){
    if(this.previousSelected) this.previousSelected.selected = false;
    this.previousSelected = folder;
    this.ParentTreeId = folder.$.id;
    folder.selected = true;
  };

  // create new folder
  createFolder(){
    let vm = this;

    //check the folderName not same for system folders
    if(vm.vncConstant.FOLDERID[vm.folderName.toUpperCase()]){
      vm.reqPending = true;
      vm.sidebarFoldersService._openCriticalErrorModel('That folder name is reserved. Please use another name.', function(){
        vm.reqPending = false;
      });
      return;
    }

    //check the valid Rss/Atom url if selected
    var pattern = /^((http|https):\/\/)/;
    if( (vm.showRssField && !vm.rssUrl) || vm.showRssField && !pattern.test(vm.rssUrl) ) {
      vm.reqPending = true;
      vm.sidebarFoldersService._openCriticalErrorModel('Please enter a valid URL. Url must begin with http: or https:', function(){
        vm.reqPending = false;
      });
      return;
    }
    //make final request
    let customFolder = {
      name: vm.folderName,
      folderId: vm.ParentTreeId || vm.parentId || vm.parentFolder,
      color: vm.availableColors.indexOf(vm.selectColor),
      url: vm.showRssField ? vm.rssUrl : null
    };
    vm.reqPending = true;
    vm.mailService.createMailFolder(customFolder, function(data, err){
      if(err) {
        err.msg = err.msg.toLowerCase();
        vm.reqPending = false;
        let invalidUrlError = 'invalid url for feed',
          invalidRssUrlError = 'document parse failed',
          duplicateError = 'object with that name already exists';
        if( (err.msg && err.msg.indexOf(invalidUrlError) > -1) || (err.msg && err.msg.indexOf(invalidRssUrlError) > -1) ){
          vm.reqPending = true;
          vm.sidebarFoldersService._openCriticalErrorModel('Content could not be retrieved. Make sure the following URL is an RSS/ATOM feed: '+ vm.rssUrl, function(){
            vm.reqPending = false;
          });
          return;
        }
        if(err.msg && err.msg.indexOf(duplicateError) > -1){
          vm.reqPending = true;
          vm.sidebarFoldersService._openCriticalErrorModel('A folder with the same name already exists. Please use another name.', function(){
            vm.reqPending = false;
          });
        }
        else{
          vm.logger.error(err.msg);
          // Close modal and passing value to target.
          vm.$mdDialog.hide();
        }
      }
      else {
        // Close modal and passing value to target.
        vm.$mdDialog.hide();
        vm.$rootScope.$broadcast("folder-added");
        // vm.logger.info('Folder "' + vm.folderName + '" was added successfully.');
        vm.details.isMoveFolder && vm.sidebarFoldersService._openMoveFolderModel(vm.details);
      }
    });
  };

  cancel(){
    this.$mdDialog.cancel();
    this.details.isMoveFolder && this.sidebarFoldersService._openMoveFolderModel(this.details);
  }
}

export default CreateNewFolderController;
