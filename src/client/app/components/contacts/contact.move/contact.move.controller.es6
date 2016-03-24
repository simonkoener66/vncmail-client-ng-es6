class ContactMoveController {
    /* @ngInject */
    constructor( $state, $mdDialog, $stateParams, mailService, vncConstant, logger, contactOperationsService ) {
        var vm = this;
        vm.moveContactAttributes = contactOperationsService.getContactOperations();
        vm.SystemFolders={
            folder:[{
                "id":vncConstant.FOLDERID.CONTACTS,
                "name":"Contacts"
            },{
                "id":vncConstant.FOLDERID.EMAILED_CONTACTS,
                "name":"Emailed Contacts"
            },{
                "id":vncConstant.FOLDERID.TRASH,
                "name":"Trash"
            }]
        };
        vm.moveContact = () => {
          let msg ;
          if(vm.moveContactAttributes.contactId.length > 1){
             msg = vm.moveContactAttributes.contactId.length+" contacts moved to " +vm.selectedFolderName;
          }else{
            msg = vm.moveContactAttributes.contactId.length+" contact moved to "+vm.selectedFolderName;
          }
          let contactId = vm.moveContactAttributes.contactId.toString();
            mailService.moveContact(contactId, vm.selectedFolderId, function(data,err){
                if(data){
                    // logger.info(msg);
                    $state.go("contacts");
                     vm.cancel();
                }
            })
        };

        vm.cancel = () => {
            $mdDialog.hide();
        };

    };
}

export default ContactMoveController;
