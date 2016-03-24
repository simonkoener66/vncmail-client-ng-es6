class SidebarDropdownButtonController {
  /* @ngInject */
  constructor(sidebarService, $uibModal) {
    let vm = this;
    vm.uibModal = $uibModal;
    vm.sidebarService = sidebarService;
    vm.dropdownLabel = vm.sidebarService.dropdownLabel;
    activate();

    function activate() {
      vm.getDropdownButtonInfos();
      vm.populateDropdownMenus();
    }
  }

  open(options) {
    let vm = this;
    let modalInstance = vm.uibModal.open({
      template: options.template,
      controller: options.use_ctrl,
      controllerAs: 'vm',
      bindToController: true,
      size: options.size || 'lg',
      windowClass: 'app-modal-window',
      backdrop: options.backdrop || true,
      resolve: {
        data: () => {
          return vm.resolve || {};
        }
      }
    });

    modalInstance.result.then(() => {
    }, () => {
    });
  }

  getDropdownButtonInfos() {
    let vm = this;
    return vm.sidebarService.getDropdownButton().then((buttonInfos) => {
      vm.dropdownButton = buttonInfos;
    });
  }

  populateDropdownMenus() {
    let vm = this;
    return vm.sidebarService.getDropdownMenus().then((menus) => {
      vm.isOpen = false;
      vm.dropdownMenus = menus;
    });
  }

  createNew() {
    let vm = this;
    switch (vm.dropdownLabel) {
    case 'New Message':
      // TODO: open new mail-mesage modal
      break;
    case 'New Appointment':
      // TODO: open new appointment modal
      break;
    default:
      break;
    }
  }
}

export default SidebarDropdownButtonController;
