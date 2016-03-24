import template from './sidebar.calendar.folder.html';
import controller from './sidebar.calendar.folder.controller';

let sidebarCalendarFolderComponent = () => {
  return {
    restrict: 'E',
    template,
    controller,
    controllerAs: 'vm',
    bindToController: true
  };
};

export default sidebarCalendarFolderComponent;
