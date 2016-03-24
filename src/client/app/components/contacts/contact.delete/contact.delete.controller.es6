class ContactDeleteController {
  /* @ngInject */
  constructor(logger, $mdDialog, $state, mailService, contactOperationsService, data, handleContactService) {
    var vm = this;
    vm.title = 'Contact Delete';
    vm.mailService = mailService;
    vm.$state = $state;
    vm.logger = logger;
    vm.$mdDialog = $mdDialog;
    vm.handleContactService = handleContactService;
    vm.deleteContactAttributes = contactOperationsService.getContactOperations();
    vm.contactDetail = (typeof data == 'string') ? JSON.parse(data) : data;
  }

  //It will delete contact from system folders and trash too
  deleteContact(){
    let vm = this,
      msg,
      request = {
        id: angular.equals({}, vm.contactDetail) ? vm.deleteContactAttributes.contactId.toString() : vm.contactDetail.contactId
      };
    if(vm.$state.current.id !== '3'){
      request.op = "move";
      request.folderId = '3';
      msg = angular.equals({}, vm.contactDetail) ?  vm.deleteContactAttributes.contactId.length + " contacts moved to Trash" : "1 contact moved to Trash";
    }
    else{
      request.op = 'delete';
      msg = angular.equals({}, vm.contactDetail) ?  vm.deleteContactAttributes.contactId.length + " contacts deleted" : "1 contact deleted";
    }

    vm.mailService.deleteContact(request, function(res){
      if(res){
        angular.equals({}, vm.contactDetail) || vm.handleContactService.removeSingleContact(vm.contactDetail.index, vm.contactDetail.contactId);
        angular.equals({}, vm.contactDetail) && vm.handleContactService.removeSelectedContacts(vm.deleteContactAttributes.contactId);
        vm.$mdDialog.hide();
        vm.logger.info(msg);
      }
    });
  };

  //It will dismiss the model while click on cancel
  cancel(){
    this.$mdDialog.hide()
  };
}
export default ContactDeleteController;
