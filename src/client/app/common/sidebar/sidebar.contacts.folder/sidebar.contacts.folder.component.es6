import template from './sidebar.contacts.folder.html';
import controller from './sidebar.contacts.folder.controller';

let sidebarContactFolderComponent = () => {
  return {
    restrict: 'E',
    scope: {},
    template,
    controller,
    controllerAs: 'vm',
    bindToController: true
  };
};

export default sidebarContactFolderComponent;
