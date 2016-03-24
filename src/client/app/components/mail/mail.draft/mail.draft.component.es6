import template from './mail.draft.html';
import controller from './mail.draft.controller';

let mailDraftComponent = () => {
    return {
        restrict: 'E',
        scope: {},
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default mailDraftComponent;
