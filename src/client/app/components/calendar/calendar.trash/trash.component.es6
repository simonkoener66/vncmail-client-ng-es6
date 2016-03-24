import controller from './trash.controller';
import template from './trash.html';
import './_trash.scss';

let calendarTrashComponent = () => {
  return {
    restrict: 'E',
    scope: {},
    template,
    controller,
    controllerAs: 'vm',
    bindToController: true
  };
};

export default calendarTrashComponent;
