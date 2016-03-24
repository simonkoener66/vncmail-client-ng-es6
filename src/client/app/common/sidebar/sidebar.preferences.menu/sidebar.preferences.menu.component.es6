import template from './sidebar.preferences/menu.html';
import controller from './sidebar.preferences/menu.controller';

let sidebarPreferenceMenuComponent = () => {
  return {
    restrict: 'E',
    scope: {},
    template,
    controller,
    controllerAs: 'vm',
    bindToController: true
  };
};

export default sidebarPreferenceMenuComponent;
