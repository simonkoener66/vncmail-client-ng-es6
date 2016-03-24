class AppController {
    /* @ngInject */
    constructor($interval, $scope, $state, $rootScope, $timeout, auth, config, dragularService, logger,
      mailService, routerHelper, $mdDialog, dataService,hotkeys,$location) {
      /* @ngInject */
        // Bind Draggable Events for all needed elementes
        // TODO: should update the structure of current components, because it is not malform for resolve promises.
        let $;

        if (!$) {
            $ = angular.element;
        }
        $interval(function() {
            let container = document.querySelector('.drag-tag-contact');
            if (container) {
                dragularService('.drag-tag-contact', {
                    nameSpace: 'tagContact',
                    copy: true,
                    isContainer: (element) => {
                        return element.id === 'vncTag';
                    },
                    scope: $scope
                });
            }
        }, 10000);

        var vm = this;
        // data initialization
        vm.sidemenu = false;
        vm.auth = auth;
        vm.$rootScope = $rootScope;
        vm.$state = $state;
        vm.mdDialog = $mdDialog;
        vm.dataService = dataService;
        vm.states = routerHelper.getStates();

        // toggle side menu on document click
        vm.sideMenuToggle = ()=> {
          $rootScope.$emit('toggle-sidemenu', true);
        };

        // listening event for toggle side menu
        $rootScope.$on('toggle-sidemenu', (e, value) => {
        /* @ngInject */
            vm.sidemenu = !value;
        });

        // item dropped events
        $scope.$on('dragulardrop', (e, element) => {
        /* @ngInject */
            e.stopPropagation();
            $timeout(() => {
                // UNDONE: Need to get correct tagNames and contact Id for assigning tag(s)
                tagContact('', '');
            }, 0);
        });

        vm.busyMessage = 'Please wait ...';
        vm.isBusy = true;
        $rootScope.showSplash = true;
        vm.navline = {
            title: config.appTitle,
            text: 'VNCUxf',
            link: 'http://www.vnc.biz'
        };

        activate();

        function activate() {
            // Creating a set of action routes to push to the navRoutes so it
            // work with the md-fab-speed-dial repeat.
            let actionRoutes = {
              name: 'create',
              title: 'Create',
              url: '#',
              settings: {
                content: 'Create',
                icon: 'create',
                tooltip: 'Compose'
              },
              template: '',
              action: 'vm.compose()'
            };
            //logger.success(config.appTitle + ' loaded!', null);
            vm.getNavRoutes();
            vm.navRoutes.unshift(actionRoutes);
            hideSplash();
        }

        function hideSplash() {
            //Force a 1 second delay so we can see the splash.
            $timeout(function() {
                $rootScope.showSplash = false;
            }, 1000);
        }

        // Assign tag(s) to a contact
        function tagContact(tagName, contactId) {
            mailService.assignTagToContact(contactId, tagName, (response, error) => {
                if (error) {
                    logger.error(error.msg);
                }
                else {
                    // logger.info('Tag successfully.');
                }
            });
        }

        /* add hotkeys */
        hotkeys.add({
          combo: ['g m'],
          callback: function( ) {
            $location.path("/mail");
          }
        });

        hotkeys.add({
          combo: ['g a'],
          callback: function( ) {
            $location.path("/contacts");
          }
        });

        hotkeys.add({
          combo: ['g c'],
          callback: function( ) {
            $location.path("/calender");
          }
        });

        hotkeys.add({
          combo: ['g p'],
          callback: function( ) {
            $location.path("/preferences");
          }
        });

        hotkeys.add({
          combo: ['/'],
          callback: function( ) {
            document.getElementById("search-field").focus();
          }
        });

        hotkeys.add({
          combo: ['ctrl+/'],
          callback: function( ) {
            //Should Focus content pane
          }
        });
        hotkeys.add({
          combo: ['ctrl+y'],
          callback: function( ) {
            //Should Focus toolbar
          }
        });
        hotkeys.add({
          combo: ['n'],
          callback: function( ) {
            //Should open New Item
          }
        });
        hotkeys.add({
          combo: ['n m'],
          callback: function( ) {
            //Should open compose new email window
          }
        });
        hotkeys.add({
          combo: ['c'],
          callback: function( ) {
            //Should open compose window
          }
        });
        hotkeys.add({
          combo: ['shift+c'],
          callback: function( ) {
            //Should open compose new email window
          }
        });
        hotkeys.add({
          combo: ['n c'],
          callback: function( ) {
            //Should open new Contact
          }
        });
        hotkeys.add({
          combo: ['n a'],
          callback: function( ) {
            //Should open new Appointment
          }
        });
        hotkeys.add({
          combo: ['n l'],
          callback: function( ) {
            //Should open new Calender
          }
        });
        hotkeys.add({
          combo: ['n e'],
          callback: function( ) {
            //Should open Add external calender
          }
        });
        hotkeys.add({
          combo: ['n d'],
          callback: function( ) {
            //Should open new document
          }
        });
        hotkeys.add({
          combo: ['n t'],
          callback: function( ) {
            //Should open new Tag
          }
        });
        hotkeys.add({
          combo: ['ctrl+right'],
          callback: function( ) {
            window.history.forward();
          }
        });
        hotkeys.add({
          combo: ['ctrl+left'],
          callback: function( ) {
            window.history.back();
            //Should go to next page
          }
        });
        hotkeys.add({
          combo: ['p'],
          callback: function( ) {
            window.print();
          }
        });
        hotkeys.add({
          combo: ['n s'],
          callback: function( ) {
            //Should Open a search tab
          }
        });
        hotkeys.add({
          combo: ['del'],
          callback: function( ) {
            //Should Delete an item
          }
        });
        hotkeys.add({
          combo: ['backspace'],
          callback: function( ) {
            //Should Delete an item
          }
        });
        hotkeys.add({
          combo: ['shift+del'],
          callback: function( ) {
            //Should Hard Delete item(s)
          }
        });
        hotkeys.add({
          combo: ['shift+backspace'],
          callback: function( ) {
            //Should Hard Delete item(s)
          }
        });
        hotkeys.add({
          combo: ['esc'],
          callback: function( ) {
            //Should close window
          }
        });
        hotkeys.add({
          combo: ['!'],
          callback: function( ) {
            //Should Quick Reminder
          }
        });
        hotkeys.add({
          combo: ['v'],
          callback: function( ) {
            //Should Go to (visit) folder
          }
        });
        hotkeys.add({
          combo: ['v v'],
          callback: function( ) {
            //Should Go to (visit) tag
          }
        });
        hotkeys.add({
          combo: ['m'],
          callback: function( ) {
            //Should Move item(s)
          }
        });
        hotkeys.add({
          combo: ['m m'],
          callback: function( ) {
            //Should Move item(s)
          }
        });
        hotkeys.add({
          combo: ['t'],
          callback: function( ) {
            //Should Tag item(s)
          }
        });
        hotkeys.add({
          combo: ['u'],
          callback: function( ) {
            //Should Remove Tag
          }
        });
        hotkeys.add({
          combo: ['s'],
          callback: function( ) {
            //Should Run a saved search
          }
        });
        hotkeys.add({
          combo: ['ctrl+shift+a'],
          callback: function( ) {
            //Should Run a saved search
          }
        });
        hotkeys.add({
          combo: [',','ctrl+enter','ctrl+space','shift+f10'],
          callback: function( ) {
            //Should Show right­click menu
          }
        });
    }
    // check is parent state is active
    isParentState(menuName) {
      /* @ngInject */
      let tempState1 = this.$state.current.name.split('.');
      return tempState1[0].substr(0, menuName.length);
    }
    getNavRoutes() {
      this.navRoutes = this.states.filter(function(r) {
        if(r.title !== 'Preferences') {
          return r.settings && r.settings.nav && r.settings.nav == 1;
        }
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
    /**
     * Open modal to compose
     *  this functions broadcast compose event
     */
    compose() {
      let vm = this;
      let options = vm.dataService.getModalCtrl();
      vm.composeDialog = vm.mdDialog;
      vm.composeDialog.show({
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

export default AppController;

AppController.$inject = ['$interval', '$scope', '$state', '$rootScope', '$timeout', 'auth', 'config', 'dragularService', 'logger', 'mailService',
'routerHelper', '$mdDialog', 'dataService','hotkeys','$location'];
