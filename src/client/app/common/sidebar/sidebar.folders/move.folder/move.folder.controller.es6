import sidebarController from './../sidebar.folders.controller.es6';

class SidebarFoldersController {
  /* @ngInject */
  constructor( mailService, $scope, vncConstant, $rootScope, $modalInstance, details, logger, sidebarFoldersService ) {

    // initialization
    var vm = this;
    vm.folders = angular.copy(sidebarFoldersService.folders);
    vm.$rootScope = $rootScope;
    vm.vncConstant = vncConstant;
    vm.mailService = mailService;
    vm.previousSelected = '';

    //close modal instance
    vm.cancel = () => {
      $modalInstance.dismiss('cancel');
    };

    vm.selectFolder = (folder) => {
      if(vm.previousSelected) vm.previousSelected.selected = false;
      vm.previousSelected = folder;
      folder.selected = true;
    };

    vm.createNewFolder = () => {
      sidebarFoldersService._openCreateNewFolderModal( this.details );
    };

    vm.move = () => {
      if(angular.isDefined(details)) {
        if (details.type == 'Email') {
          mailService.moveEmail(details.emailId, vm.previousSelected.$.id, function (res, err) {
            if (err) {
              logger.error(err.msg);
            }
            else {
              $rootScope.$broadcast("event:moveEvent", details.key, details.index, vm.previousSelected);
              $modalInstance.close();
            }
          })
        }
        else if (details.type == 'Message') {
          mailService.moveMessage(details.emailId, vm.previousSelected.$.id, function (res, err) {
            if (err) {
              logger.error(err.msg);
            }
            else {
              $rootScope.$broadcast("event:moveMsgEvent", details.index, details.emailId, vm.previousSelected);
              $modalInstance.close();
            }
          })
        }
      }
      $modalInstance.dismiss();
    };

    $scope.$on('updateFolder', function(){
      vm.folders = angular.copy(sidebarFoldersService.folders);
    });

    $scope.search = function (folder) {
      return (angular.lowercase(folder.$.name).indexOf(angular.lowercase($scope.query) || '') !== -1 )
    };

  };

  getColor(number){
    return number ? this.vncConstant.COLOR_CODES[number].toLowerCase() : 'yellow';
  };
}

export default SidebarFoldersController;
