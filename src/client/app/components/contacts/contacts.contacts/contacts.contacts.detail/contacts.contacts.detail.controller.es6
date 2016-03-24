import ContactComposeController from '../../contact.compose/contact.compose.controller';
import contactComposeTemplate from '../../contact.compose/contact.compose.html';
import contactComposeDeleteTemplate from '../../contact.delete/contact.delete.html';
import contactMoveTemplate from '../../contact.move/contact.move.html';
import contactFilterTemplate from '../../contacts.contacts/contact.filter.html';


class ContactsDetailController {
  /*@ngInject*/
  constructor($stateParams, $rootScope, $interval, contactDetailsService, $state, $mdDialog, contactCountService, vncConstant, $scope) {

    // data initialization
    let vm = this;
    vm.selectedContactId = $stateParams.contactId;
    vm.vncConstant = vncConstant;
    vm.$rootScope = $rootScope;
    vm.$state = $state;
    vm.$interval = $interval;
    vm.contactsDetails = contactDetailsService.getContactDetails();
    vm.contactCount = contactCountService.getContactCount();
    vm.singleContactDetail = [];
    vm.contactDetail = [];
    vm.selectedContactAddress  = [];
    vm.addressType = {};
    vm.addressType["home"] = "Home";
    vm.addressType["work"] = "Work";
    vm.addressType["other"] = "Other";
    vm.isSelectedContactId = true;
    vm.firstInitial = "";
    vm.lastInitial = "";
    vm.avatarInitials = "";
    vm.location = "";
    vm.$mdDialog = $mdDialog;
    vm.contactComposeTemplate = contactComposeTemplate;
    vm.contactMoveTemplate = contactMoveTemplate;
    vm.contactComposeDeleteTemplate = contactComposeDeleteTemplate;
    vm.contactFilterTemplate = contactFilterTemplate;
    let addressIndexes = [];

    // check current state and set location
    if(($state.current.name).indexOf('contacts.contacts.detail') !== -1){
      vm.location = "Contacts";
    }
    if(($state.current.name).indexOf('contacts.emailedContacts.detail') !== -1){
      vm.location = "Emailed Contacts";
    }
    if(($state.current.name).indexOf('contacts.trashContacts.detail') !== -1){
      vm.location = "Trash Contacts";
    }

    // update tags in message
    $scope.$on('event:contact-tag-updated', function(e, data, cond){
      if(vm.contactDetail.allTags.length){
        if(cond == 'add') vm.contactDetail.allTags.push(data);
        else if(cond == 'remove') vm.contactDetail.allTags.splice(data, 1);
        else vm.contactDetail.allTags = [];
      }
    });

    vm.init = () => {
      if (angular.isDefined(vm.selectedContactId) && vm.selectedContactId != '') {
        vm.loadContactDetails(vm.contactsDetails);
      }else {
        vm.isSelectedContactId = false;
      }
    };

    vm.editContact = () => {
        vm.$mdDialog.show({
        controller: ContactComposeController,
        controllerAs: 'vm',
        bindToController: true,
        template: contactComposeTemplate,
        escapeToClose: false,
        fullscreen: true,
        resolve: {
          data: () => {
            return {operation: 'edit'};
          }
        }
      });
    };

    vm.loadContactDetails = (contactsDetails) => {
      if(contactsDetails.length){
        vm.handleContactDetail(contactsDetails);
      }else{
        vm.singleContactDetail.push(contactsDetails);
        vm.handleContactDetail(vm.singleContactDetail);
      }
    };

    vm.backToContact = () => {
      let detailPane = document.querySelector('#contactDetailPage');
      let button = document.querySelector('.back-to-contact');
      detailPane.classList.toggle('show');
    };

    vm.composeMail = () => {
      this.$state.go('mail');
      var mailView = this.$interval( () => {
          if ( this.$state.includes('mail') ) {
            this.$rootScope.$broadcast('compose:event', {
              email: this.contactDetail.email,
              displayName: this.contactDetail.firstName + ' ' + this.contactDetail.lastName
            });
            this.$interval.cancel(mailView);
          }
      });
    };

    vm.handleContactDetail = (contactsDetails) => {
      for (var i=0;i<contactsDetails.length;i++){
        if(angular.isDefined(contactsDetails[i].$) && contactsDetails[i].$.id === vm.selectedContactId) {
          vm.contact = contactsDetails[i];
          if(angular.isDefined(contactsDetails[i].a.length)){
            for(var j=0;j<contactsDetails[i].a.length;j++){
              vm.contactDetail[contactsDetails[i].a[j].$.n] =  contactsDetails[i].a[j]._;
            }
          }else{
              vm.contactDetail[contactsDetails[i].a.$.n] =  contactsDetails[i].a._;
          }
        }
      }
      if(angular.isDefined(vm.contactDetail.firstName)){
        vm.firstInitial = vm.contactDetail.firstName.charAt(0);
      }else{
        vm.firstInitial = 'N';
      }

      if(angular.isDefined(vm.contactDetail.lastName)){
        vm.lastInitial = vm.contactDetail.lastName.charAt(0);
      }else{
        vm.lastInitial = 'N';
      }

      vm.avatarInitials = vm.firstInitial+vm.lastInitial;
      if ( angular.isDefined(vm.contact) ) {
        vm.contactDetail['allTags'] = vm.contact.$.allTags;
        // Get Avatar
        let contactInfo =  vm.contact.$;
        let foundAvatar = false;
        _.some(vm.contact.a, function(data){
            if (angular.isDefined(data.$) && data.$.n === 'image') {
              foundAvatar = true;
              return foundAvatar;
            }
        });

        if ( foundAvatar ) {
          vm.image = vm.vncConstant.ZimbraAPI + '/getAvatar?user_id=' + contactInfo.id;
        }
      }

      vm.getAddressDetail(vm.contactDetail);
    };

    vm.getAddressDetail = (input) => {
      let city = "",
          state = "",
          postalCode = "",
          country = "",
          street = "";
      for (var key in input) {
        if (key.indexOf("City") != -1|| key.indexOf("Street") != -1|| key.indexOf("State") != -1 ||
            key.indexOf("PostalCode") != -1|| key.indexOf("Country") != -1) {
          var index = key.replace(/^\D+/g,'')|| "";
          var type = "home";
          if (key.startsWith("work")) {
            type = "work";
          } else if (key.startsWith("other")) {
            type = "other";
          }

          city = input[type+ "City"+ index];
          street = input[type+ "Street"+ index];
          state = input[type+ "State"+ index];
          postalCode = input[type+ "PostalCode"+ index];
          country = input[type + "Country"+ index];
          var isFound = false;
          for(var i = 0; i< addressIndexes.length;i++){
            if(addressIndexes[i].type == type && addressIndexes[i].index == index){
              isFound = true;
              break;
            }
          }

          if(!isFound || addressIndexes.length == 0){
            addressIndexes.push({index : index,type : type});
            vm.selectedContactAddress.push({
              type : vm.addressType[type],
              city : city,
              state : state,
              street : street,
              postalcode : postalCode,
              country : country
            });
          }
        }
      }
    };
    vm.init();
  }
}

export default ContactsDetailController;
