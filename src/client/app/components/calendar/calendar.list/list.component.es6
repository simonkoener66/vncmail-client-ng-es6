import controller from './list.controller';
import template from './list.html';
import './_list.scss';

let calendarListComponent = () => {
  return {
    restrict: 'E',
    scope: {},
    template,
    controller,
    controllerAs: 'vm',
    bindToController: true
  };
};

export default calendarListComponent;
