import template from './calendarHourListInDay.html';
import controller from './calendarHourListInDay.controller';

let calendarHourListInDayComponent = function () {
  return {
    restrict: 'E',
    replace: true,
    template,
    controller,
    scope: {
      currentDay: '=',
      dayViewStart: '=',
      dayViewEnd: '=',
      dayViewSplit: '=',
      onTimespanClick: '=',
      onTimeSlotClick: '=',
      dayEvents: '=',
      calendarFolderList: '='
    },
    controllerAs: 'vm',
    bindToController: true
  };
};

export default calendarHourListInDayComponent;
