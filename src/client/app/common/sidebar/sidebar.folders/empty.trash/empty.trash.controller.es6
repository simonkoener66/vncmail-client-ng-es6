class EmptyFolderController {
  /* @ngInject */
  constructor( $rootScope, logger, $mdDialog, mailService, data) {
    var vm = this;
    vm.details = (typeof data == 'string') ? JSON.parse(data) : data;
    if(vm.details && vm.details.$){
      vm.folderId = vm.details.$.id;
      vm.folderName = vm.details.$.name.toLowerCase();
    }
    vm.isTrash = vm.folderName == 'trash';

    if(vm.isTrash){
      vm.emptyTrash = () => {
        mailService.emptyTrash( function (res, err) {
          if ( err ) logger.error( err.msg );
          if ( res ) {
            $rootScope.$broadcast("folder-added");
            // logger.success('Folder "Trash" emptied')
          }
          $mdDialog.hide();
        });
      }
    }
    else {
      vm.emptyTrash = () => {
        mailService.makeFolderAction( vm.folderId, 'empty', function (res, err) {
          if ( err ) logger.error( err.msg );
          if ( res ) {
            $rootScope.$broadcast("folder-added");
            // logger.success('Folder "'+ vm.details.$.name +'" emptied')
          }
          $mdDialog.hide();
        });
      }
    }

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  };
}

export default EmptyFolderController;
