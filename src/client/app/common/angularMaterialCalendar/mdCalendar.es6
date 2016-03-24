import angular from 'angular';
//import interact from 'interact';
import moment from 'moment';

// components
import mdCalendarComponent from './mdCalendar.component';
import mdCalendarYearViewComponent from './mdCalendarViewYear/mdCalendarYearView.component';
import mdCalendarMonthViewComponent from './mdCalendarViewMonth/mdCalendarMonthView.component';
import mdCalendarWeekViewComponent from './mdCalendarViewWeek/mdCalendarWeekView.component';
import mdCalendarDayViewComponent from './mdCalendarViewDay/mdCalendarDayView.component';
import mdCalendarHourListInWeekComponent from './mdCalendarViewHourListInWeek/calendarHourListInWeek.component';
import mdCalendarHourListInDayComponent from './mdCalendarViewHourListInDay/calendarHourListInDay.component';
import mdCalendarResizerComponent from './mdCalendarResizer/resizer.component';

import mdCalendarCollapseFallbackComponent from './mdCalendarCollapseFallback/mdCalendarCollapseFallback.component';
import mdCalendarDateModifierComponent from './mdCalendarDateModifier/mdCalendarDateModifier.component';
import mdCalendarDraggableComponent from './mdCalendarDraggable/mdCalendarDraggable.component';
import mdCalendarDroppableComponent from './mdCalendarDroppable/mdCalendarDroppable.component';
import mdCalendarElementDimensionsComponent from './mdCalendarElementDimensions/mdCalendarElementDimensions.component';
import mdResizableComponent from './mdCalendarResizable/mdResizable.component';

// services
import mdCalendarConfig from './mdCalendarServices/mdCalendar.config';
import mdCalendarHelperService from './mdCalendarServices/mdCalendarHelper.service';
import mdCalendarTitleService from './mdCalendarServices/mdCalendarTitle.service';

// filters
import mdCalendarDateFilter from './mdCalendarFilter/mdCalendarDate.filter';
import mdCalendarLimitToFilter from './mdCalendarFilter/mdCalendarLimitTo.filter';
import mdCalendarTruncateEventTitleFilter from './mdCalendarFilter/mdCalendarTruncateEventTitle.filter';
import mdCalendarTrustAsHtmlFilter from './mdCalendarFilter/mdCalendarTrustAsHtml.filter';

import mdCalendarIncludeRepaceTemplate from './mdCalendarIncludeReplaceTemplate/mdCalendarIncludeReplaceTemplate.component';

// templates
import mdCalendarMonthCell from './mdCalendarViewMonth/mdCalendarMonthCell.html';
import mdCalendarMonthCellEvents from './mdCalendarViewMonth/mdCalendarMonthCell.html';

let interact = null; //require('interact.js');

let calendar = angular.module('vnc.ngMdCalendar', [])
  .run(templateCache)
  .config(function ($mdIconProvider) {
    $mdIconProvider
      .iconSet('mdi','./../../../images/mdi.svg', 24)
      .defaultIconSet('./../../../images/mdi.svg', 24);
  })
  .constant('moment', moment)
  .constant('interact', interact)
  .provider('calendarConfig', mdCalendarConfig)
  .factory('calendarHelper', mdCalendarHelperService)
  .factory('calendarTitle', mdCalendarTitleService)
  .filter('calendarDate', mdCalendarDateFilter)
  .filter('calendarLimitTo', mdCalendarLimitToFilter)
  .filter('calendarTruncateEventTitle', mdCalendarTruncateEventTitleFilter)
  .filter('calendarTrustAsHtml', mdCalendarTrustAsHtmlFilter)
  .directive('vncMdCalendar', mdCalendarComponent)
  .directive('vncMdCalendarYear', mdCalendarYearViewComponent)
  .directive('vncMdCalendarMonth', mdCalendarMonthViewComponent)
  .directive('vncMdCalendarWeek', mdCalendarWeekViewComponent)
  .directive('vncMdCalendarDay', mdCalendarDayViewComponent)
  .directive('vncCalendarHourListInWeek', mdCalendarHourListInWeekComponent)
  .directive('vncCalendarHourListInDay', mdCalendarHourListInDayComponent)
  .directive('calendarResizer', mdCalendarResizerComponent)
  //.directive('mwlCollapseFallback', mdCalendarCollapseFallbackComponent)
  .directive('mwlDateModifier', mdCalendarDateModifierComponent)
  .directive('mwlDraggable', mdCalendarDraggableComponent)
  .directive('mwlDroppable', mdCalendarDroppableComponent)
  .directive('mwlElementDimensions', mdCalendarElementDimensionsComponent)
  .directive('mwlResizable', mdResizableComponent)
  .directive('includeReplace', mdCalendarIncludeRepaceTemplate);

templateCache.$inject = ['$templateCache'];
function templateCache($templateCache) {
  $templateCache.put('calendarMonthCell.html', mdCalendarMonthCell);
  $templateCache.put('calendarMonthCellEvents.html', mdCalendarMonthCellEvents);
}

export default calendar;

