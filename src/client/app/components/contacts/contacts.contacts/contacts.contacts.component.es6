import template from './contacts.contacts.html';
import controller from './contacts.contacts.controller';
import './_contacts.contacts.scss';

let contactsContactsComponent = () => {
    return {
        restrict: 'E',
        scope: {},
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default contactsContactsComponent;
