class userHelpController {
  /* @ngInject */
  constructor( logger, $mdDialog ) {
    let vm = this;

    vm.closeModel = () => {
      // Close modal and passing value to target.
      $mdDialog.hide();
    };
  };
}


export default userHelpController;
