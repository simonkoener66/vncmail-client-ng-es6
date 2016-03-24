import template from './sidebar.mail.folder.html';
import controller from './sidebar.mail.folder.controller';

let sidebarMailFolderComponent = () => {
  return {
    restrict: 'E',
    scope: {},
    template,
    controller,
    controllerAs: 'vm',
    bindToController: true
  };
};

export default sidebarMailFolderComponent;
