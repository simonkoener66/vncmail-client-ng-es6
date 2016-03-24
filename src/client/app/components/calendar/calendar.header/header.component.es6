import controller from './header.controller';
import template from './header.html';
import './_header.scss';

let calendarHeaderComponent = () => {
  return {
    restrict: 'E',
    scope: {},
    template,
    controller,
    controllerAs: 'vm',
    bindToController: true
  };
};

calendarHeaderComponent.$inject = [];

export default calendarHeaderComponent;
