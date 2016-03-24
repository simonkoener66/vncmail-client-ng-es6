import template from './contacts.html';
import controller from './contacts.controller';
import '../contacts/contact.compose/_contact.compose.scss';

let contactsComponent = () => {
    return {
        restrict: 'E',
        scope: {},
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default contactsComponent;
