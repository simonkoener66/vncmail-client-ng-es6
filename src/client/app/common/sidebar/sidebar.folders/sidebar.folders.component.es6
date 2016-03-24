import template from './sidebar.folders.html';
import controller from './sidebar.folders.controller';

let sidebarFoldersComponent = function () {
    return {
        restrict: 'EA',
        scope: {
          folders: '=',
          folderAction: '&',
          currentState: '@',
          currentChildState: '='
        },
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default sidebarFoldersComponent;
