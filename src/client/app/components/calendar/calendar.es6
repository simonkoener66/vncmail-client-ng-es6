import coreModule from '../../common/core/core';
import headerModule from './calendar.header/header';
import viewModule from './calendar.view/view';
import listModule from './calendar.list/list';
import trashModule from './calendar.trash/trash';

import calendarRun from './calendar.run';
import calendarComponent from './calendar.component';
import calendarService from './calendar.service';

let calendarModule = angular.module('calendar', [
  coreModule.name,
  headerModule.name,
  viewModule.name,
  listModule.name,
  trashModule.name
])
  .run(calendarRun)
  .directive('calendar', calendarComponent)
  .service('calendarService', calendarService);

export default calendarModule;
