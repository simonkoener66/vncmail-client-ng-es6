import template from './sidebar.tasks.folder.html';
import controller from './sidebar.tasks.folder.controller';

let sidebarTaskFolderComponent = () => {
  return {
    restrict: 'E',
    scope: {},
    template,
    controller,
    controllerAs: 'vm',
    bindToController: true
  };
};

export default sidebarTaskFolderComponent;
