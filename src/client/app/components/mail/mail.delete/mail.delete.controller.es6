class MailDeleteController {
  /* @ngInject */
  constructor( $modalInstance, mailService, logger, id, isTrash ) {
    let vm = this;
    vm.isTrash  = isTrash;
    // Accept mail deletion
    vm.ok = () => {
      mailService.deleteEmail(id, function(res, err){
          if(res){
            // logger.success('Email deleted successfully');
            $modalInstance.close();
          }
        else logger.error(err);
      });
    };

    // Cancel mail deletion
    vm.cancel = () => {
      $modalInstance.dismiss('cancel');
    };

  }
}

export default MailDeleteController;
