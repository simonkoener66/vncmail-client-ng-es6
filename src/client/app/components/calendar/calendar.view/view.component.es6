import controller from './view.controller';
import template from './view.html';
import './_view.scss';

let calendarViewComponent = () => {
  return {
    restrict: 'E',
    scope: {},
    template,
    controller,
    controllerAs: 'vm',
    bindToController: true
  };
};

export default calendarViewComponent;
