import template from './hamburger.html';
import controller from './hamburger.controller';

/* @ngInject */
let hamburgerComponent = () => {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
        state: '='
    },
    template,
    controller,
    controllerAs: 'vm',
    bindToController: true
  };
};

export default hamburgerComponent;
