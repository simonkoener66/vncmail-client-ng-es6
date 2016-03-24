const SCOPE = new WeakMap();
const ROOTSCOPE = new WeakMap();
const LOGGER = new WeakMap();

class SidebarCalendarFolderController {
  /* @ngInject */
  constructor($rootScope, $scope, logger, mailService, vncConstant, sidebarService, sidebarCalendarFolderService) {
    let vm = this;
    SCOPE.set(vm, $scope);
    ROOTSCOPE.set(vm, $rootScope);
    LOGGER.set(vm, logger);

    vm.mailService = mailService;

    sidebarCalendarFolderService.apiUrl = $rootScope.API_URL;
    vm.sidebarService = sidebarService;
    vm.sidebarCalendarFolderService = sidebarCalendarFolderService;
    vm.vncConstant = vncConstant;

    vm.activate();
  }

  activate() {
    let vm = this;

    // for drop handler and more...
    vm.treeOptions = {
      /**
       * Check if the current selected node can be dragged.
       * @param {Object}  currentNodeScope The scope of source node which is selected.
       * @returns {Boolean} True allows it to be dragged.
       */
      beforeDrag: (currentNodeScope) => {
        let currentCalendarNode = currentNodeScope.$modelValue.$;

        // DONOT accept drop requests from both Calendar (ID: 10) and Trash (ID: 3)
        return currentCalendarNode.id !== '3' && currentCalendarNode.id !== '10';
      },
      dropped: (event) => {
        let source = event.source.nodeScope.$modelValue.$,
            target = event.dest.nodesScope.item ? event.dest.nodesScope.item.$ : undefined;

        // prevent droped on the same parent...
        if (target.id === source.l) {
          return;
        }

        let moveFolderActionRequest = {
          id: source.id,
          l: target.id
        };

        vm.mailService.moveFolder(moveFolderActionRequest, (res) => {
          // LOGGER.get(vm).info('Calendar "' + source.name + '" moved to "' + target.name + '".');
        });
      }
    };

    vm.getUserFolders();
    //    vm.getMenus();

    SCOPE.get(vm).$on('calendar-added', () => {
      vm.getUserFolders();
    });
  }

  getUserFolders() {
    let vm = this;
    vm.loading = true;
    vm.sidebarCalendarFolderService.getUserCalendarTree(
      (folders) => {
        vm.loading = false;
        vm.folders = folders;
//        vm.sidebarCalendarFolderService.setSelectedFolders(vm.folders);
      }, (error) => {
        vm.loading = false;
        LOGGER.get(vm).error('SidebarCalendarFolderController::getUserFolders');
      });
  }

  getMenus() {
    let vm = this;
    vm.sidebarCalendarFolderService.getCalendarExternalMenu().then((menu) => {
      vm.externalMenu = menu;
    });

    vm.sidebarCalendarFolderService.getCalendarInternalMenu().then((menu) => {
      vm.internalMenu = menu;
    });
  }

  /**
   * Gets color for the icon with give color ID String.
   * @param   {string} colorId The Color ID defined by Zimbra.
   * @returns {string} Color class name.
   */
  getColor(colorId) {
    let vm = this;
    return colorId ? vm.vncConstant.COLOR_CODES[Number(colorId)].toLowerCase() : 'dark-grey';
  }

  nodeClicked(node) {
    let vm = this;
    vm.sidebarService.selectedCalendarFolder = node;
    vm.sidebarCalendarFolderService.SelectedCalendarFolder = node;
  }

  toggle(scope) {
    scope.toggle();
  }

  checkChanged(node) {
    let vm = this;

    if (node.$.id === '3') {
      ROOTSCOPE.get(vm).$broadcast('TRASH_CHECKED_CHANGED', node.isChecked);
      // Don't check its children.
    }

    vm.sidebarCalendarFolderService.updateCalendarCheckStateRecursively(node, node.isChecked);
  }
}

export default SidebarCalendarFolderController;
