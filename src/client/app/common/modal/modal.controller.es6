class ModalController {
  /* @ngInject */
  constructor($uibModal, $mdDialog) {
    let vm = this;
    vm.uibModal = $uibModal;
    vm.$mdDialog = $mdDialog;
  }

  open(){
    let vm = this;
    vm.$mdDialog.show({
      controller: vm.useCtrl,
      controllerAs: 'vm',
      bindToController: true,
      template: vm.template,
      escapeToClose: false,
      fullscreen: true,
      resolve: {
        data: () => {
          return vm.resolve || {};
        }
      }
    });
  };
}

export default ModalController;
