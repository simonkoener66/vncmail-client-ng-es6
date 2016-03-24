import template from './mdCalendar.html';
import controller from './mdCalendar.controller';
import './_mdCalendar.scss';
import './mdCalendarTemp/_materialCalendar.scss';

let calendarComponent = function () {
  return {
    restrict: 'EA',
    template,
    controller,
    scope: {
      events: '=',
      view: '=',
      viewTitle: '=?',
      currentDay: '=',
      editEventHtml: '=',
      deleteEventHtml: '=',
      cellIsOpen: '=',
      onEventClick: '&',
      onEventTimesChanged: '&',
      onEditEventClick: '&',
      onDeleteEventClick: '&',
      onTimespanClick: '&',
      onTimeSlotClick: '&',
      onDrillDownClick: '&',
      cellModifier: '&',
      dayViewStart: '@',
      dayViewEnd: '@',
      dayViewSplit: '@',
      monthCellTemplateUrl: '@',
      monthCellEventsTemplateUrl: '@',
      firstDayOfWeek: '@',
      isShowWeekNumber: '=',
      calendarFolderList: '='
    },
    controllerAs: 'vm',
    bindToController: true
  };



};

export default calendarComponent;
