import angular from 'angular';
import uiRouter from 'angular-ui-router';
import contactsContactsComponent from './contacts.contacts.component';
import contactsDetailModule from './contacts.contacts.detail/contacts.contacts.detail';
import contactsDistributionListDetailModule from './contacts.distribution.list.detail/contacts.distribution.list.detail';
import ContactComposeController from '../contact.compose/contact.compose.controller';
import ContactDeleteController from '../contact.delete/contact.delete.controller';
import ContactMoveController from '../contact.move/contact.move.controller';
import handleContactService from './contacts.handleContact.service.es6';
import ngClickOutside from 'angular-click-outside';
import '../contact.compose/_contact.compose.scss';
import '../contact.delete/_contact.delete.scss';
import '../contact.move/_contact.move.scss';


let contactsContactsModule = angular.module('contacts.contacts', [
    uiRouter, contactsDetailModule.name, contactsDistributionListDetailModule.name, 'tw.directives.clickOutside'
])
.run(appRun)
.controller('ContactComposeController', ContactComposeController)
.service('handleContactService', handleContactService)
.service('contactDetailsService', function (){
    let contactDetails = {};

    return {
        getContactDetails: function () {
            return contactDetails;
        },
        setContactDetails: function (value) {
            contactDetails = value;
        }
    };
})

.service('contactOperationsService', function() {
  let contactOperations = {};
  return {
    getContactOperations : function () {
      return contactOperations;
    },
    setContactOperations : function(folderId,value) {
      contactOperations = {"contactFolder": folderId, "contactId" : value};
    }
  }
})

.service('contactCountService', function(){
  let contactCount;
  return{
    getContactCount : function () {
      return contactCount;
    },
    setContactCount : function (noOfContacts, totalNoOfContacts, loadMore){
      contactCount = {"NoOfContacts": noOfContacts, "TotalNoOfContacts" : totalNoOfContacts, "LoadMore" : loadMore};
    }
  }
})

.controller('ContactDeleteController',ContactDeleteController)
.controller('ContactMoveController',ContactMoveController)
.directive('whenScrolled', function() {
    console.log("whenScrolled");
	return function(scope, elm, attr) {
		var raw = elm[0];
		elm.bind('scroll', function() {
			if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight - 100) {
				scope.$apply(attr.whenScrolled);
			}
		});
	};
})
.directive('contactsContacts', contactsContactsComponent);

appRun.$inject = ['routerHelper'];
/* @ngInject */

function appRun( routerHelper ) {
    "ngInject";
    routerHelper.configureStates(getStates());
}

function getStates() {
    return [
        {
            state: 'contacts.contacts',
            config: {
                url: '/list',
                id:'7',
                template: '<contacts-contacts></contacts-contacts>',
                title: 'Contacts',
                settings: {
                    nav: 2,
                    tooltip: 'Personal Contacts',
                    content: 'Contacts'
                }
            }
        },
        {
            state: 'contacts.emailedContacts',
            config: {
                url: '/emailed',
                id:'13',
                template: '<contacts-contacts></contacts-contacts>',
                title: 'Emailed Contacts',
                settings: {
                    nav: 2,
                    content: 'Emailed Contacts'
                }
            }
        },
        {
            state: 'contacts.trashContacts',
            config: {
                url: '/trash',
                id:'3',
                template: '<contacts-contacts></contacts-contacts>',
                title: 'Trash',
                settings: {
                    nav: 2,
                    content: 'Trash'
                }
            }
        },
        {
          state: 'contacts.otherContacts',
          config: {
            url: '/other/:id/:title',
            template: '<contacts-contacts></contacts-contacts>',
            settings: {
              nav: 2,
              content: 'Other'
            }
          }
       }
    ];
}
export default contactsContactsModule;
