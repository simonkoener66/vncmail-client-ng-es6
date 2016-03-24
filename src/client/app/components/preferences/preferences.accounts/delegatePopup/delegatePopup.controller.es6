class DelegatePopupController {
  /* @ngInject */
  constructor( $modalInstance, $rootScope, data ) {
    var vm = this;
    if(angular.equals({}, data)){
      vm.delegatePermission = {
        emailAddress: '',
        sendAs: '',
        sendOnBehalf: ''
      };
    }
    else{
      vm.delegatePermission = JSON.parse(data);
      vm.hideEmailField = true;
    }


    vm.cancel = () => {
      $modalInstance.dismiss('cancel');
    };

    vm.addDelegation = (value) =>{
        vm.delegatePermission.updated = value;
        $rootScope.$broadcast('delegationPermissionItem', vm.delegatePermission);
        $modalInstance.close();
    }
  }
}

export default DelegatePopupController;
