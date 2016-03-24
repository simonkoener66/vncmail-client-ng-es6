import sidebarDropdownButtonComponent from './dropdownButton.component';

let sidebarDropdownButtonModule = angular.module('sidebarDropdownButton', [])
  .directive('vncSidebarDropdownButton', sidebarDropdownButtonComponent)
export default sidebarDropdownButtonModule;
