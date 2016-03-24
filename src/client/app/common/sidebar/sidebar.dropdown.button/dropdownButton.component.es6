import template from './dropdownButton.html';
import controller from './dropdownButton.controller';
import './_dropdownButton.scss';

let sidebarDropdownButtonComponent = () => {
  return {
    restrict: 'EA',
    scope: {},
    template,
    controller,
    controllerAs: 'vm',
    bindToController: true
  };
};

export default sidebarDropdownButtonComponent;
