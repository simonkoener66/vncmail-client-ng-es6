class SidemenuController {
  /*@ngInject*/
  constructor( $rootScope, routerHelper, $state, auth ) {

    // data initialization
    var vm = this;
    vm.sidemenu = false;
    vm.states = routerHelper.getStates();

    // services initialization
    vm.auth = auth;
    vm.$state = $state;
    activate();

    // toggle side menu on document click
    vm.sideMenuToggle = function(){
      vm.sidemenu = false;
      $rootScope.$emit('toggle-sidemenu', true);
    };

    // listening event for toggle side menu
    $rootScope.$on('toggle-sidemenu', (e, value) => {
      vm.sidemenu = !value;
    });

    function activate() { vm.getNavRoutes(); }

  }

  // check is parent state is active
  isParentState(menuName) {
    let tempState1 = this.$state.current.name.split('.');
    return tempState1[0].substr(0, menuName.length);
  }

  getNavRoutes() {
    this.navRoutes = this.states.filter(function(r) {
      return r.settings && r.settings.nav && r.settings.nav == 1;
    }).sort(function(r1, r2) {
      return r1.settings.nav - r2.settings.nav;
    });
  }

  isCurrent(route){
    /* @ngInject */
    if (!route.title || !this.$state.current || !this.$state.current.title) {
      return '';
    }
    var menuName = angular.lowercase(route.title);
    return angular.lowercase(this.isParentState(menuName)) === menuName ? 'current' : '';
  }
}

export default SidemenuController;
