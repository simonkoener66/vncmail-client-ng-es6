class DeleteFolderController {
  /* @ngInject */
  constructor( $rootScope, logger, $mdDialog, mailService, data) {
    var vm = this;
    vm.title = 'Delete Folder';
    vm.isTrash = false; //in case of trash folder items
    vm.details = (typeof data == 'string') ? JSON.parse(data) : data;
    if(vm.details && vm.details.$){
      vm.isTrash = vm.details.$.l == 3;
      vm.folderName = vm.details.$.name;
      vm.folderId = vm.details.$.id;
      vm.parentFolder = vm.details.$.id;
    }

    vm.deleteFolder = () => {
      if ( !vm.isTrash ) {
        mailService.deleteFolder(vm.folderId, function (res, err) {
          if ( err ) logger.error( err.msg );
          if ( res ) {
            // logger.success('Contacts folder "'+vm.folderName +'" moved to "Trash"');
            $rootScope.$broadcast("folder-added", vm.details.$.l);
          }
          $mdDialog.hide();
        });
      }

      else{
        mailService.deleteFolderFromTrash(vm.folderId, function ( res, err ) {
          if ( err ) logger.error( err.msg );
          if ( res ) {
            // logger.success(vm.folderName +' deleted successfully');
            $rootScope.$broadcast("folder-added", vm.details.$.l);
          }
        });
        $mdDialog.hide();
      }
    };
    vm.cancel = () => {
      $mdDialog.cancel();
    };
  };
}

export default DeleteFolderController;
