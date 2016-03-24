class RenameFolderController {
    /* @ngInject */
    constructor( $rootScope, logger, $mdDialog, mailService, data, vncConstant, sidebarFoldersService, hotkeys) {
        var vm = this;
        vm.details = (typeof data == 'string') ? JSON.parse(data) : data;
        vm.reqPending = false;
        if( vm.details && vm.details.$){
          vm.oldName = vm.details.$.name;
          vm.folderName = angular.copy(vm.details.$.name);
          vm.folderId = vm.details.$.id;
        }

        vm.$rootScope = $rootScope;
        vm.logger = logger;
        vm.$mdDialog = $mdDialog;
        vm.mailService = mailService;
        vm.vncConstant = vncConstant;
        vm.sidebarFoldersService = sidebarFoldersService;
        /* add hotkeys */
        hotkeys.add({
          combo: ['enter', 'space'],
          callback: function( ) {
            vm.renameFolder()
          }
        });

        hotkeys.add({
          combo: ['esc'],
          callback: function( ) {
          vm.cancel()
          }
        });
    };

  renameFolder(){
    let vm = this;
    let folderName = vm.folderName.split(' ').join('_');
    if( vm.vncConstant.FOLDERID[folderName.toUpperCase()] ){
      vm.reqPending = true;
      vm.sidebarFoldersService._openCriticalErrorModel('That folder name is reserved. Please use another name.', function(){
        vm.reqPending = false;
      });

      //vm.logger.error('That folder name is reserved. Please use another name.');
      return;
    }
    if(vm.folderName == vm.details.$.name){
      //close modal instance
      vm.$mdDialog.cancel();
    }
    else{
      let options = {
        id: vm.folderId,
        name: vm.folderName
      };
      vm.mailService.renameFolder(options, function(res, err){
        if ( err ) {
          let duplicateError = 'object with that name already exists';
          if(err.msg && err.msg.indexOf(duplicateError) > -1){
            vm.reqPending = true;
            vm.sidebarFoldersService._openCriticalErrorModel('A folder with the same name already exists. Please use another name.', function(){
              vm.reqPending = false;
            });
          }
          else{
            vm.logger.error(err.msg);
            vm.$mdDialog.hide();
          }
        }
        if( res ) {
          // vm.logger.success(vm.folderName +' renamed successfully');
          vm.$rootScope.$broadcast("folder-added", vm.details.$.l);
          vm.$mdDialog.hide();
        }
      });
    }
  };

  cancel(){
    this.$mdDialog.cancel();
  };
}

export default RenameFolderController;
