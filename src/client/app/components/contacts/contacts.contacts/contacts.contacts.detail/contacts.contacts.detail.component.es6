import template from './contacts.contacts.detail.html';
import controller from './contacts.contacts.detail.controller';
import './_contacts.contacts.detail.scss';

let contactsDetailComponent = function () {
    return {
        restrict: 'E',
        scope: {},
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default contactsDetailComponent;
