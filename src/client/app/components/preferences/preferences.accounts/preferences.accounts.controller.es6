import delegateTemplate from './delegatePopup/delegatePermission.html';

class PreferencesAccountsController {
  /* @ngInject */
  constructor( $scope ) {
    var vm = this;
    vm.delegateTemplate = delegateTemplate;
    vm.delegateList = [];
    vm.enableButton = true;
    vm.accounts = [{accountName: 'Primary Account', status: 'OK', emailAddress: 'umairkz@gmail.com', accountType: 'primary'}];
    vm.selectedObj = vm.accounts[0];
    vm.showPassword = "password";
    let indexExternalAccount = 0,
        indexPersonaAccount = 0;

    vm.addExternalAccount = () => {
      indexExternalAccount++;
      let externalAccount = {accountName: 'New External Account'+indexExternalAccount, status: 'OK', emailAddress: '', accountType: 'POP'};
      vm.accounts.push(externalAccount)
    };

    vm.addPersonaAccount = () => {
      indexPersonaAccount++;
      let personaAccount = {accountName: 'New Persona'+indexPersonaAccount, status: 'OK', emailAddress: 'umairkz@gmail.com', accountType: 'Persona'};
      vm.accounts.push(personaAccount)
    };

    vm.getAccountObj = (obj, index) => {
      vm.isDisabled = obj.accountType === 'primary';
      vm.selectedObj = obj;
      vm.accountObjIndex = index;

    };

    vm.deleteAccount = () => {
      vm.accounts.splice(vm.accountObjIndex, 1);
    };

    vm.getDelegateObj = (obj, index) => {
      vm.delegateObj = obj;
      vm.delegateObjIndex = index;
      vm.enableButton = false;
    };

    vm.deleteDelegate = () => {
      vm.delegateList.splice(vm.delegateObjIndex, 1);
      vm.delegateObjIndex = NaN;
      vm.enableButton = true;
      vm.delegateObj = null;
    };

    $scope.$on('delegationPermissionItem', function (event, data) {
      if(data.updated) vm.delegateList[vm.delegateObjIndex] = data;
      else vm.delegateList.push(data);
    });

  }
}

export default PreferencesAccountsController;
