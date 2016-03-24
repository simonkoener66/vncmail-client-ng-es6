class HeaderController {
  /* @ngInject */
  constructor( $rootScope, auth, $state, routerHelper, $interval, vncConstant, logger, mailService,
    $scope, AUTH_EVENTS, $timeout, $translate, $mdDialog, dataService,hotkeys) {

    let vm = this;
    vm.name = 'header';
    vm.totalUnreadEmail = 0;
    vm.totalUpcomingAppointments = 0;
    vm.rootScope = $rootScope;
    vm.$translate = $translate;

    //TODO remove this if approved
    vm.today = new Date();
    vm.states = routerHelper.getStates();
    vm.$state = $state;
    vm.vncConstant = vncConstant;
    vm.mailService = mailService;
    vm.mdDialog = $mdDialog;
    vm.dataService = dataService;
    vm.$interval = $interval;
    vm.searchOpen = false;
    vm.icons = {
                contact: 'account_circle'
            };
    $rootScope.$watch('parentTitle', function(newVal){
        vm.title = newVal;
        $timeout(function(){
          vm.setLoadingBar();
        }, 100);
    });

    // clear search field
    $rootScope.$on('clearHeaderSearch', function(){
      vm.search = '';
    });

    $scope.$on(AUTH_EVENTS.loginSuccess, () => {
        vm.auth = auth;
        //When the component is instantiated run the activate function
        this.activate();
        // This is use for loading unread email number at the first time
        this.getTotalUnreadEmail();
    });

    $scope.$on(AUTH_EVENTS.notAuthenticated, function (event, msg) {
      console.info('notAuthenticated');
      $state.go('login');
    });

    $scope.$on(AUTH_EVENTS.loginRequired, function (event, msg) {
      $state.go('login');
    });

    $scope.$on(AUTH_EVENTS.loggedOut, function (event, msg) {
      if(window.location.href.indexOf('debug=true') !== -1){
      }
      $state.go('login');
    });

    hotkeys.add({
      combo: ['shift+/'],
      callback: function( ) {
        vm.openHelpMenu('userShortcuts');
      }
    });

    hotkeys.add({
      combo: ['ctrl+q'],
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function( ) {
        vm.openHelpMenu('userShortcuts');
      }
    });
  }
  changeLanguage(langKey) {
    var vm = this;
    vm.$translate.use(langKey);
  };
  /*
     Set loading bar according to route title
   */
  setLoadingBar(){
    let $;
    if (!$) {
      $ = angular.element;
    }
    let $loadingBarSpinner = $('#loading-bar-spinner');
    let $title= $('#title');

    if($title[0]){
      $loadingBarSpinner.css('left', 45 + $title[0].offsetWidth + 'px')
    }
  }

  // toggle side menu
  sideMenuToggle(){
    this.rootScope.$emit('toggle-sidebar');
  }

  activate() {
      // load the unread email number every 10 second
      if (this.auth.authenticated) {
          this.$interval(() => {

              //getTotalUnreadEmail();
              this.getTotalUnreadEmail();
              this.getTotalUpcomingAppointments();
          }, 60000);
      }
  }

  getTotalUnreadEmail() {
      var vm = this ;
        let request = {
            types: 'conversation',
            needExp: 1,
            offset: 0,
            query: [vm.vncConstant.SEARCH_CRITERIA.IN_INBOX, vm.vncConstant.SEARCH_CRITERIA.IS_UNREAD],
            recip: '0',
            sortBy: 'dateDesc',
            limit: 100,
            fullConversation: 0
        };
      vm.mailService.getEmailList(request, function (res) {
            if (angular.isArray(res)) {
                vm.totalUnreadEmail = res.length > 99 ? '99+' : res.length;
            } else {
                vm.totalUnreadEmail = 0;
            }
      });
  }

  getTotalUpcomingAppointments() {
      var vm = this ;
      var d = new Date();
      var calExpandInstStart = Date.now();
      var calExpandInstEnd = new Date(d.getFullYear() + 10, 12, 31);
        let request = {
            offset: 0,
            limit: 100,
            types: 'appointment',
            query: 'inid: 10',
            fetch:'u',
            recip: 0,
            fullConversation: 0,
            calExpandInstStart: calExpandInstStart,
            calExpandInstEnd: calExpandInstEnd.getTime()
            };

            vm.mailService.searchRequest(request, (res) => {
                  if (angular.isDefined(res.appt) && angular.isArray(res.appt)) {
                      vm.totalUpcomingAppointments = res.appt.length > 99 ? '99+' : res.appt.length;
                  } else {
                      vm.totalUpcomingAppointments = 0;
                  }
            });
  }

  searchEmail(e) {
    var vm = this;
    if(vm.searchOpen) {
      if(e){
          if(e.which === 13) {
            this.rootScope.$broadcast('search', this.search);
            vm.searchOpen =false;
          }
      }
      else {
          this.rootScope.$broadcast('search', this.search);
          vm.searchOpen =false;
      }
    } else {
      vm.searchOpen = true;
      document.getElementById('search-field').focus();
      return;
    }

  }

  logout() {
    this.auth.logout();
  }

  openMenu ($mdOpenMenu, ev) {
    var vm = this;
    let originatorEv = ev;
    $mdOpenMenu(ev);
  };

  openHelpMenu(modelType) {
    let vm = this;
    let options = vm.dataService.getUserModalCtrl(modelType);

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
    // this.$rootScope.$broadcast('compose:event');
  }

}

export default HeaderController;
