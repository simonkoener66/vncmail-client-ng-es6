import template from './mail.list.html';
import controller from './mail.list.controller';

let mailListComponent = () => {
    return {
        restrict: 'E',
        scope: {
          showBy: '=',
          queryBy: '=',
          currentFolder: '=',
          folderId: '='
        },
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default mailListComponent;
