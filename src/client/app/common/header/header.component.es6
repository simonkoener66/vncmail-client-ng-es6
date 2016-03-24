import template from './header.html';
import controller from './header.controller';

//Usage:
//<vnc-header></vnc-header>

let headerComponent = () => {
  return {
    restrict: 'EA',
    scope: {
      'navline': '='
    },
    template,
    controller,
    controllerAs: 'vm',
    bindToController: true
  };
};

export default headerComponent;
