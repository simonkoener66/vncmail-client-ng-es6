import template from './preferencesContacts.html';
import controller from './preferencesContacts.controller';

let preferencesContactsComponent = () => {
    return {
        restrict: 'E',
        scope: {},
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default preferencesContactsComponent;
