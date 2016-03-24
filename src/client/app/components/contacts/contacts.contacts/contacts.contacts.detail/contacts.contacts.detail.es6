import angular from 'angular';
import uiRouter from 'angular-ui-router';
import contactsDetailComponent from './contacts.contacts.detail.component';

let contactsDetailModule = angular.module('contacts.contacts.detail', [
    uiRouter, 'contacts'
])

.run(appRun)

.filter('getcontactdetails', function() {
	return function(input, filter) {
		if (!angular.isObject(input))
			return input;
		var returnValue = {};
		for ( var key in input) {
			if (key.indexOf(filter) != -1) {
				returnValue[key] = input[key];
			}
		}
		return returnValue;
	}
})

.directive('contactsContactsDetail', contactsDetailComponent);

appRun.$inject = ['routerHelper'];
/* @ngInject */

function appRun( routerHelper ) {
    "ngInject";
    routerHelper.configureStates(getStates());
}

function getStates() {
    return [
        {
            state: 'contacts.contacts.detail',
            config: {
                url: '/detail/:contactId',
                id: '7',
                template: '<contacts-contacts-detail></contacts-contacts-detail>',
                title: 'Detail Contacts',
                settings: {
                    nav: 3,
                    content: 'Contact Detail'
                }
            }
        },
        {
            state: 'contacts.emailedContacts.detail',
            config: {
                url: '/detail/:contactId',
                id: '13',
                template: '<contacts-contacts-detail></contacts-contacts-detail>',
                title: 'Detail EmailedContacts',
                settings: {
                    nav: 3,
                    content: 'Contact Detail'
                }
            }
        },
        {
            state: 'contacts.trashContacts.detail',
            config: {
                url: '/detail/:contactId',
                id: '3',
                template: '<contacts-contacts-detail></contacts-contacts-detail>',
                title: 'Detail TrashContacts',
                settings: {
                    nav: 3,
                    content: 'Contact Detail'
                }
            }
        },
        {
          state: 'contacts.otherContacts.detail',
          config: {
            url: '/detail/:contactId',
            id: '3',
            template: '<contacts-contacts-detail></contacts-contacts-detail>',
            title: 'Detail otherContacts',
            settings: {
              nav: 3,
              content: 'Contact Detail'
            }
          }
       }
    ];
}
export default contactsDetailModule;
