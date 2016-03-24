import template from './mail.junk.html';
import controller from './mail.junk.controller';

let mailJunkComponent = () => {
    return {
        restrict: 'E',
        scope: {},
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default mailJunkComponent;
