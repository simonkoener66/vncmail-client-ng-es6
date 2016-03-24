let handleContactService = function( $state ){

  let vm = this;
  vm.contacts = [];
  vm.detailUrl = 'contacts';

  this.addContact = function(contact){
    vm.contacts.push(contact);
  };

  this.removeContacts = function(){
    vm.contacts = [];
  };

  this.removeSingleContact = (index, id) => {
    this.isSelectedContact([id]);
    vm.contacts[index].id == id && vm.contacts.splice(index, 1);
  };

  this.removeSelectedContacts = (ids) => {
    this.isSelectedContact(ids);
    vm.contacts = vm.contacts.filter(function(contact){
      if(!ids.includes(contact.id)) return contact;
    });
  };

  this.isSelectedContact = function(ids){
    ids.includes($state.params.contactId) && $state.go('contacts.'+ vm.detailUrl +'.detail',{'contactId' :  undefined});
  };

};

handleContactService.$inject = ['$state'];
/*@ngInject*/

export default handleContactService;
