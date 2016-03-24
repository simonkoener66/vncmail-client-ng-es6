import template from './mail.inbox.html';
import controller from './mail.inbox.controller';
import './_mail.inbox.scss';

let mailInboxComponent = function () {
    return {
        restrict: 'E',
        scope: {},
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default mailInboxComponent;
