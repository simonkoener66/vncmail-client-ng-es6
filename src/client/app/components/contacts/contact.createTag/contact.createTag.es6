import angular from 'angular';
import uiRouter from 'angular-ui-router';
import contactCreateTagComponent from './contacts.createTag.component';
import coreModule from '../../common/core/core';
import contactsContacts from './contacts.contacts/contacts.contacts';


let contactCreateTagModule = angular.module('contact.createTag', [])
    .directive('contactCreateTag', contactCreateTagComponent);

export default contactCreateTagModule;
