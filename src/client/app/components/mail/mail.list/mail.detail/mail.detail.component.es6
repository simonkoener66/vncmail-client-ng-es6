import template from './mail.detail.html';
import controller from './mail.detail.controller';
import './_mail.detail.scss';

let mailDetailComponent = function () {
    return {
        restrict: 'E',
        scope: {
            mailDetail : '=',
            mailIndex : '=',
            mailKey : '=',
            mailFolder : '='
        },
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default mailDetailComponent;
