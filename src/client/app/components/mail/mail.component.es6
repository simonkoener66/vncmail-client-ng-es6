import template from './mail.html';
import controller from './mail.controller';

let mailComponent = () => {
    return {
        restrict: 'E',
        scope: {},
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default mailComponent;
