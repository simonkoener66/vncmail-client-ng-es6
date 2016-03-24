import template from './calendarHourListInWeek.html';
import controller from './calendarHourListInWeek.controller';

let calendarHourListInWeekComponent = function () {
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
      dayInWeek: '=',
      isShowWorkWeek: '=',
      calendarFolderList: '='
    },
    controllerAs: 'vm',
    bindToController: true
  };
};

export default calendarHourListInWeekComponent;
