import calendarViewComponent from './view.component';
import calendarViewRun from './view.run';
import calendarViewService from './view.service';

let calendarViewModule = angular.module('calendar.view', [])
  .run(calendarViewRun)
  .directive('calendarView', calendarViewComponent)
  .service('calendarViewService', calendarViewService);

export default calendarViewModule;
