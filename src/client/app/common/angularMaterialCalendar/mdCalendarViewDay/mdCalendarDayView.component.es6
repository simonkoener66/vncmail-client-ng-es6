import template from './mdCalendarDayView.html';
import controller from './mdCalendarDayView.controller';

let mdCalendarDayViewComponent = function () {
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
      onEventTimesChanged: '=',
      onTimespanClick: '=',
      dayViewStart: '=',
      dayViewEnd: '=',
      dayViewSplit: '=',
      calendarFolderList: '=',
      onTimeSlotClick: '='
    },
    controllerAs: 'vm',
    bindToController: true
  };
};

export default mdCalendarDayViewComponent;
