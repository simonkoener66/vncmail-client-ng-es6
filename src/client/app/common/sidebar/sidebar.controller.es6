import createNewTagTemplate from '../tag/create.new.tag/create.new.tag.html';

class SidebarController {
  /* @ngInject */
  constructor($scope, $state, $rootScope, tagService, $q,
              auth, mailService, sidebarService, routerHelper, vncConstant, dataService, $mdDialog) {
    let vm = this;

    vm.auth = auth;
    vm.mailService = mailService;
    vm.sidebarService = sidebarService;
    vm.states = routerHelper.getStates();
    vm.$state = $state;
    vm.$rootScope = $rootScope;
    vm.vncConstant = vncConstant;
    vm.dataService = dataService;
    vm.mdDialog = $mdDialog;
    vm.tagService = tagService;
    vm.$q = $q;
    vm.tags = tagService.tags;
    vm.sidebar = true;
    vm.createNewTagTemplate = createNewTagTemplate;
    vm.currentParentState = $state.current.name.split('.')[0];
    $rootScope.$watch('parentTitle', function(newVal){
      vm.currentParentState = newVal;
    });

    vm.activate();

    // listening event for toggle side menu
    $rootScope.$on('toggle-sidebar', (e) => {
      vm.sidebar = !vm.sidebar;
    });

    // Drop handler for selected contact.
    vm.onDrop = (data, event, r) => {
      let customObjectData = data['json/custom-object'];
      if (angular.isDefined(customObjectData.contact)) {
        let contactId = customObjectData.contact.id;
        vm.mailService.moveContact(contactId, r.id, (data, err) => {
          if (customObjectData.index) {
            vm.$rootScope.$broadcast('contact-list-called', {message: customObjectData.index});
          }
        });
      }
    }
  }

  activate() {
    this.getNavRoutes();
    this.getFolderMenu();
    this.getTagMenu();
    this.tagService._getTagList()
  }

  getNavRoutes() {
    this.navRoutes = this.states.filter((route) => {
      if (route.name === 'calendar.view') {
        route.hasCalendarTreeView = true;
      }

      return route.settings &&
        route.settings.nav &&
        route.settings.nav === 2 &&
        this.filterParentState(route);
    });
  }

  // Folders for menu
  getFolderMenu() {
    return this.sidebarService.getFolderMenu().then((data) => {
      this.folderMenu = data;
    });
  }

  // Tags for menu
  getTagMenu() {
    return this.sidebarService.getTagMenu().then((data) => {
      this.tagMenu = data;
    });
  }

  isSelectingRoute(route) {
    if (!route.title || !this.$state.current || !this.$state.current.title) {
      return '';
    }

    let menuName = angular.lowercase(route.title);
    return angular.lowercase(this.$state.current.title.substr(0, menuName.length)) === menuName ?
      'current' : '';
  }

  // check is parent state is active
  filterParentState(state) {
    return (this.$state.current.name.split('.')[0]) == (state.name.split('.')[0]);
  }

  composeModal() {
    let vm = this;
    let options = vm.dataService.getModalCtrl();

    vm.mdDialog.show({
      controller: options.ctrl,
      controllerAs: 'vm',
      bindToController: true,
      template: options.template,
      escapeToClose: false,
      fullscreen: true,
      resolve: {
        data: () => {
          return vm.resolve || {};
        }
      }
    });
  }
}

export default SidebarController;
