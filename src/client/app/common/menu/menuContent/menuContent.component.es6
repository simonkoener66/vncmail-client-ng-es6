import template from './menuContent.html';
import controller from './menuContent.controller';

let menuContentComponent = () => {
  return {
    restrict: 'EA',
    scope: false,
    template,
    controller,
    controllerAs: 'vm',
    bindToController: true
  };
};


export default menuContentComponent;
