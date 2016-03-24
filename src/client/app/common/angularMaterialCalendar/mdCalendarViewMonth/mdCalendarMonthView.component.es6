import template from './mdCalendarMonthView.html';
import controller from './mdCalendarMonthView.controller';

let mdCalendarMonthViewComponent = function () {
  let link = (scope, element, attrs, calendarCtrl)=> {
    scope.vm.calendarCtrl = calendarCtrl;
  };

  return {
    restrict: 'EA',
    require: '^vncMdCalendar',
    replace: true,
    template,
    controller,
    scope: {
      events: '=',
      currentDay: '=',
      onEventClick: '=',
      onEditEventClick: '=',
      onDeleteEventClick: '=',
      onEventTimesChanged: '=',
      editEventHtml: '=',
      deleteEventHtml: '=',
      cellIsOpen: '=',
      onTimespanClick: '=',
      cellModifier: '=',
      cellTemplateUrl: '@',
      cellEventsTemplateUrl: '@',
      isShowWeekNumber: '='
    },
    link,
    controllerAs: 'vm',
    bindToController: true
  };
};

export default mdCalendarMonthViewComponent;
