import loginErrorTemplate from './loginErrorTemplate.html';
class LoginController {
    /*@ngInject*/
    constructor($scope, $location, logger, auth, AUTH_EVENTS, $mdToast, $document) {
      // data initialization
      var vm = this;
      vm.flag = true;
      vm.$mdToast = $mdToast;
      vm.auth = auth;
      vm.showError = false;
      vm.errorMessage = '';
      vm.user = {};
      vm.title = 'Login';
      vm.logger = logger;

      activate();

      $scope.$on(AUTH_EVENTS.loginSuccess, (event, msg) => {
        vm.auth = auth;
        $location.path('/mail/inbox');
        //$location.path('/calendar/month');
      });

      $scope.$on(AUTH_EVENTS.loginFailed, (event, msg) => {
        if( vm.flag && vm.showError ){
          vm.flag = false;
          $mdToast.show({
            controller: function( $mdToast ){
              this.ok = () => {
                vm.flag = vm.showError= true;
                $mdToast.hide();
              };
            },
            controllerAs: 'vm',
            bindToController: true,
            template: loginErrorTemplate,
            parent : $document[0].querySelector('#toastBounds'),
            hideDelay: 0,
            position: "left right bottom"
          })
        }
      });

      function activate() {
        vm.user.username = 'dhavald@zuxfdev.vnc.biz';
        vm.user.password = 'zuxfdev!1';
      }
    }

    login(){
      let vm = this;
      vm.showError = true;
    	vm.auth.login(vm.user.username, vm.user.password)
        .then(function (data) {
        	vm.auth = data;
        }, function(reason){

        });
    }

}

export default LoginController;
