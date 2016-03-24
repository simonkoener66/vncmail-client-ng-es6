class ContactsDistributionListDetailController {
    /*@ngInject*/
    constructor($stateParams) {

        let vm = this;
        vm.selectedContactId = $stateParams.contactId;
        vm.isSelectedContactId = true;
    }
}

export default ContactsDistributionListDetailController;
