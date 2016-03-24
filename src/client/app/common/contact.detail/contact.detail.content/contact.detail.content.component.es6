import template from './contact.detail.content.html';
import controller from './contact.detail.content.controller';

let contactDetailContentComponent = () => {
  return {
    restrict: 'EA',
    scope: false,
    template,
    controller,
    controllerAs: 'vm',
    bindToController: true
  };
};


export default contactDetailContentComponent;
