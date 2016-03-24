import calendarListComponent from './list.component';
import calendarListRun from './list.run';

let calendarListModule = angular.module('calendar.list', [])
  .run(calendarListRun)
  .directive('calendarList', calendarListComponent);

export default calendarListModule;
