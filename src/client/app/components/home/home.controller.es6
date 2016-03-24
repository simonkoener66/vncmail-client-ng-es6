/* jshint -W104, -W119 */
class HomeController {
    /*@ngInject*/
    constructor($rootScope, $scope, $location, $state, logger, AuthService) {
        var vm = this;
        vm.AuthService = AuthService;
        vm.logger = logger;
        vm.$rootScope = $rootScope;
        vm.$state = $state;
        vm.$location = $location;
        vm.title = 'Home';
        activate();

        function activate() {
          // logger.info('Activated Home');
        }
    }


}

export default HomeController;

