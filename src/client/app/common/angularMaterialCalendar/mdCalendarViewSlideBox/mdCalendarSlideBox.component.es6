import template from './mdCalendarSlideBox.html';
import controller from './mdCalendarSlideBox.controller';

let mdCalendarYearViewComponent = function () {
  let link = (scope, element, attrs, ctrls)=> {
    scope.isMonthView = !!ctrls[0];
    scope.isYearView = !!ctrls[1];
  };

  return {
    restrict: 'EA',
    require: ['^?mwlCalendarMonth', '^?mwlCalendarYear'],
    replace: true,
    template,
    controller,
    scope: {
      isOpen: '=',
      events: '=',
      onEventClick: '=',
      editEventHtml: '=',
      onEditEventClick: '=',
      deleteEventHtml: '=',
      onDeleteEventClick: '='
    },
    link,
    controllerAs: 'vm',
    bindToController: true
  };
};

export default mdCalendarYearViewComponent;
