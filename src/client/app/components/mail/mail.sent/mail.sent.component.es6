import template from './mail.sent.html';
import controller from './mail.sent.controller';

let mailSentComponent = () => {
    return {
        restrict: 'E',
        scope: {},
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default mailSentComponent;
