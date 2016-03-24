import template from './mail.trash.html';
import controller from './mail.trash.controller';

let mailTrashComponent = () => {
    return {
        restrict: 'E',
        scope: {},
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default mailTrashComponent;
