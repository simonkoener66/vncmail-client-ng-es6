class exportController {
  /* @ngInject */
  constructor( $rootScope, $http ) {
    var vm = this;
    vm.startExport = () => {
      $http.get($rootScope.API_URL + '/exportContacts')
        .success(function(res){
          // console.log("res", res)
        })
        .error(function(res){
          // console.log("err", res)
        });
    }
  }
}

export default exportController;
