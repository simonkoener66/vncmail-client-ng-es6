import template from './mdCalendarWeekView.html';
import controller from './mdCalendarWeekView.controller';

let mdCalendarWeekViewComponent = function () {
  let link = (scope, element, attrs, calendarCtrl) => {
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
      onEventTimesChanged: '=',
      dayViewStart: '=',
      dayViewEnd: '=',
      dayViewSplit: '=',
      onTimespanClick: '=',
      isShowWorkWeek: '=',
      onTimeSlotClick: '=',
      calendarFolderList: '='
    },
    link,
    controllerAs: 'vm',
    bindToController: true
  };
};

export default mdCalendarWeekViewComponent;
