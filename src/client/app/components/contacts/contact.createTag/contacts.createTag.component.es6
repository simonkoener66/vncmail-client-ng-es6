import template from './contacts.createTag.html';
import controller from './contacts.createTag.controller';

let contactCreateTagComponent = () => {
    return {
        restrict: 'E',
        scope: {},
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default contactCreateTagComponent;
