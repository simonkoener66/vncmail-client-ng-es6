import template from './login.html';
import controller from './login.controller';

let loginComponent = () => {
    return {
        restrict: 'E',
        scope: {},
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default loginComponent;
