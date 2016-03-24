import template from './mdCalendarYearView.html';
import controller from './mdCalendarYearView.controller';

let mdCalendarYearViewComponent = function () {
  let link = (scope, element, attrs, calendarCtrl)=> {
    scope.vm.calendarCtrl = calendarCtrl;
  };

  return {
    restrict: 'AE',
    require: '^vncMdCalendar',
    replace: true,
    template,
    controller,
    scope: {
      events: '=',
      currentDay: '=',
      onEventClick: '=',
      onEventTimesChanged: '=',
      onEditEventClick: '=',
      onDeleteEventClick: '=',
      editEventHtml: '=',
      deleteEventHtml: '=',
      cellIsOpen: '=',
      onTimespanClick: '=',
      cellModifier: '='
    },
    link,
    controllerAs: 'vm',
    bindToController: true
  };
};

export default mdCalendarYearViewComponent;
