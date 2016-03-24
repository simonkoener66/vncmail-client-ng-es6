class MailFullScreenController {
  /* @ngInject */
  constructor( $mdDialog, index, key, detail, folderId ) {

    let vm = this;
    vm.index  = index;
    vm.key = key;
    vm.detail = detail;
    vm.folderId = folderId;

    vm.ok = () => {
      $mdDialog.hide();
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };

  }
}

export default MailFullScreenController;
