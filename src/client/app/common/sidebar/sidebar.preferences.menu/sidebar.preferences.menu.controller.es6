const SCOPE = new WeakMap();

class SidebarPreferenceMenuController {
  /* @ngInject */
  constructor($scope, $rootScope, mailService, vncConstant, $state, routerHelper, sidebarFoldersService) {
    let vm = this;
    vm.mailService = mailService;
    vm.$rootScope = $rootScope;
    vm.vncConstant = vncConstant;
    vm.$state = $state;
    vm.states = routerHelper.getStates();
    vm.sidebarFoldersService = sidebarFoldersService;
    vm.folders = [];
    vm.loading = true;
    vm.activate();

    $scope.$on('folder-added', function(e, folderID){
      vm.getUserFolders();
      vm.currentId = folderID;
    });

    $scope.$on('event:updateNoOfMails', () => {
      vm.getUserFolders();
    });
  }

  activate() {
    this.getUserFolders();
    this.getNavRotes();
  }

  // check is parent state is active
  filterParentState(state) {
    let tempState1 = this.$state.current.name.split('.');
    let tempState2 = state.name.split('.');
    return tempState1[0] == tempState2[0];
  }

  getNavRotes(){
    this.navRoutes = this.states.filter((route) => {
      return route.settings &&
        route.settings.nav &&
        route.settings.nav === 2 &&
        this.filterParentState(route);
    });
  }

  foldersAction(item){
    for(let i = 0; i < this.navRoutes.length; i++){
       if(angular.lowercase(this.navRoutes[i].title) == angular.lowercase(item.$.name)){
         this.$state.go(this.navRoutes[i].name);
         return;
       }
    }
    this.$state.go('preferences.preferences');
  }

  getUserFolders(){
    let vm = this;
    vm.loading = true;
    vm.sidebarFoldersService._getPreferenceFolders(function(folders){
      vm.loading = false;
      vm.folders = folders;
    });
  };

}

export default SidebarPreferenceMenuController;
