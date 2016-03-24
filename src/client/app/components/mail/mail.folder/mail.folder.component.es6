import template from './mail.folder.html';
import controller from './mail.folder.controller';
import './_mail.folder.scss';

let mailFolderComponent = function () {
    return {
        restrict: 'E',
        scope: {},
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default mailFolderComponent;
