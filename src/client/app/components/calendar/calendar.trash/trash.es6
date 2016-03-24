import calendarTrashComponent from './trash.component';

let calendarTrashModule = angular.module('calendar.trash', [])
  .directive('vncCalendarTrash', calendarTrashComponent);

export default calendarTrashModule;
