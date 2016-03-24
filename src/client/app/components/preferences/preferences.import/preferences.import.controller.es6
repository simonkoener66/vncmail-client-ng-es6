class ImportController {
  /* @ngInject */
  constructor($rootScope, $http, Upload, preferenceService) {

    //data initialization
    var vm = this;
    vm.exts = ['.csv', '.tgz', '.ics'];

    vm.validType = false;

    vm.checkFile = (file) => {
      vm.importFile = file;
      if(vm.importFile) {
        if(vm.validExtension()){
          vm.validType = true;
        }
      }
    };

    vm.validExtension = () => {
      let vm = this;
      let fileName = vm.importFile;
      return (new RegExp('(' + vm.exts.join('|').replace(/\./g, '\\.') + ')$')).test(vm.importFile.name);
    };

    vm.startImport = () => {
      //TODO:encodeURIComponent
      //Upload.upload({
      //  url: $rootScope.API_URL + '/importContacts',
      //  data: {file: vm.importFile, email: 'dhavald@zuxfdev.vnc.biz'}
      //}).then(function (resp) {

      //});
      preferenceService.importContacts(vm.importFile, 'dhavald@zuxfdev.vnc.biz', function(res, err){
        //console.log("res")
        //console.log(res)
        //console.log("err")
        //console.log(err)
      })
    }
  }
}

export default ImportController;
