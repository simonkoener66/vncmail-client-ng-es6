import angular from 'angular';
import materialCalendarService from './materialCalendar.calendar.service';
import materialCalendarDataService from './materialCalendar.data.service';
import materialCalendarComponent from './materialCalendar.component';

let vncMaterialCalendar = angular.module('vncMaterialCalendar', ['ngMaterial', 'ngSanitize'])
  .service('materialCalendarService', materialCalendarService)
  .service('materialCalendarDataService', materialCalendarDataService)
  .directive('vncMdCalendarTemp', materialCalendarComponent);

export default vncMaterialCalendar;

