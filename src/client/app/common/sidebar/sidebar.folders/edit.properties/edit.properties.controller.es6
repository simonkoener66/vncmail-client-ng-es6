class CreateNewFolderController {
  /* @ngInject */
  constructor( logger, $mdDialog, mailService, $rootScope, vncConstant, sidebarFoldersService, data, auth) {

    // initialization
    var vm = this;
    vm.reqPending = false;
    vm.errorMessage = '';
    vm.selectColor = 'Select color';
    vm.availableColors = vncConstant.COLOR_CODES;
    vm.availableColors[0] = vm.selectColor;

    //by default properties tab selected
    vm.propertiesTab =true;
    vm.properties = () => {
      vm.propertiesTab =true;
    };
    vm.retention = () => {
      vm.propertiesTab = false;
    };

    //get folders details
    vm.details = (typeof data == 'string') ? JSON.parse(data) : data;
    if( vm.details && vm.details.$){
      vm.editFolderName = vncConstant.FOLDERID[vm.details.$.name.toUpperCase()];
      vm.folderName = vm.details.$.name;
      vm.folderColor = vm.availableColors[vm.details.$.color] || 'Custom';
      vm.folderNewName = angular.copy(vm.details.$.name);
      vm.folderId = vm.details.$.id;
      vm.selectColor = vm.availableColors[vm.details.$.color] || 'Custom';
      //getting folder share details
      if( vm.details.acl && vm.details.acl.grant ){
        vm.shareDetials = angular.isArray(vm.details.acl.grant) ?  vm.details.acl.grant : [vm.details.acl.grant];
      }
    }

    vm.updateShareOptions = (id) =>{
      $rootScope.$broadcast('folder-added');
      let request = {folder:
          { l: id }
        };
      mailService.getFolderList( request, function( res ,err ){
        vm.details = res;
        if( vm.details.acl && vm.details.acl.grant ){
          vm.shareDetials = angular.isArray(vm.details.acl.grant) ?  vm.details.acl.grant : [vm.details.acl.grant];
        }
        else{
          vm.shareDetials = false;
        }
      });
    };

    $rootScope.$on('Sharing Changed', function ( e, id ){
      vm.updateShareOptions(id)
    });

    vm.addShareFolder = () => {
      sidebarFoldersService._openShareFolderModal( vm.details );
    };

    vm.editShareFolder = (index) => {
      vm.details.share = {
        granteeEmail: vm.shareDetials[index].$.zid,
        granteeRole: vm.shareDetials[index].$.perm,
        granteeType: vm.shareDetials[index].$.gt
      };
      sidebarFoldersService._openShareFolderModal( vm.details );
    };

    vm.revokeShareFolder = (index) => {
        let request = {
          id: vm.folderId,
          op: '!grant',
          zid:  vm.shareDetials[index].$.zid
        };
      mailService.shareFolder(request, function( res, err ){
        if(err){
          logger.error(err.msg)
        }
        else{
          vm.updateShareOptions(vm.details.$.id);
          let options = {
            id: vm.folderId,
            emailInfo: vm.shareDetials[index].$.zid,
            action: 'revoke'
          };
          mailService.sendShareFolderRequest(options, function( res, err ){
            if(err){
              logger.error(err.msg);
            }
            else{
              // logger.success('Share Message Sent');
            }
          });
        }
      });
    };

    vm.resendShareMessage = (index) => {
      let options = {
        id: vm.folderId,
        emailInfo: vm.shareDetials[index].$.zid
      };
      mailService.sendShareFolderRequest(options, function( res, err ){
        if(err){
          logger.error(err.msg);
        }
        else{
          // logger.success('Share Message Sent');
        }
      });
    };

    // create new folder
    vm.editFolder = () => {
      vm.folderNewName = vm.folderNewName.toLowerCase();
      vm.folderName = vm.folderName.toLowerCase();
      if( vm.folderNewName == vm.folderName && vm.selectColor == vm.folderColor){
        //close modal instance
        $mdDialog.cancel();
      }
      else{
        //check the folderName is changed and the Name not same for system folders
        if(( vm.folderNewName != vm.folderName ) && vncConstant.FOLDERID[ vm.folderNewName.split(' ').join('_').toUpperCase() ] ){
          logger.error('That folder name is reserved. Please use another name.');
          return;
        }

        let options = {
          id: vm.folderId,
          name: vm.folderNewName,
          color: vm.availableColors.indexOf( vm.selectColor )
        };

        mailService.editFolderProperties(vm.folderId, options, function( res, err ){
          if(err) {
            err.msg = err.msg.toLowerCase();
            vm.reqPending = false;
            let duplicateError = 'object with that name already exists';
            if( err.msg && err.msg.indexOf(duplicateError) > -1 ){
              vm.errorMessage = 'A folder with the same name already exists. Please use another name.';
              vm.openErrorModel();
            }
            else{
              logger.error(err.msg);
              // Close modal and passing value to target.
              $mdDialog.hide();
            }
          }
          else {
            // Close modal and passing value to target.
            $mdDialog.hide();
            $rootScope.$broadcast("folder-added");
          }
        });
      }
    };
    vm.cancel = () => {
      $mdDialog.cancel();
    };
  };

  errorController($rootScope, $scope, $modalInstance, errorMessage){
    $scope.errorMessage = errorMessage;
    $scope.ok = () => {
      // send email with empty title
      $modalInstance.close();
    };
  };
}

export default CreateNewFolderController;
