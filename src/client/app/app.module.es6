import 'babel-polyfill';

import angular from 'angular';
import ngAnimate from 'angular-animate';
import ngAria from 'angular-aria';
import ngMessages from 'angular-messages';
import ngMaterial from 'angular-material';
import uiRouter from 'angular-ui-router';
import ngCookies from 'angular-cookies';
import angularLoadingBar from 'angular-loading-bar';
import ngFileUpload from 'ng-file-upload';
import ngSmartTable from 'angular-smart-table';
import Common from './common/common';
import Components from './components/components';
import AppComponent from './app.component';
import ngColoPicker from 'angular-color-picker';
import angularResiable from 'angular-resizable';
import DragularModule from '../js/dragular.js';
import 'ng-tags-input';
import 'angular-filter/dist/angular-filter.js';
import 'angular-filter';
import 'angular_material_scss';
import './app.scss';
import './angular-resizable.min.scss';
import 'angular-hotkeys';

let AppModule = angular.module('app', [
    ngAnimate,
    ngAria,
    ngMessages,
    ngMaterial,
    uiRouter,
    ngCookies,
    angularLoadingBar,
    ngFileUpload,
    'ngTagsInput',
    //'AngularXmppServices',
    'angular.filter',
    'mp.colorPicker',
    'angularResizable',
    'smart-table',
    'cfp.hotkeys',
    DragularModule.name,
    Common.name,
    Components.name

  ])

  .run()
  .config(['$provide', function ($provide) {
    //$provide.decorator('uibTimepickerDirective', function ($delegate) {
    //  let directive = $delegate[0];
    //  directive.templateUrl = 'time.picker.template';
    //  return $delegate;
    //});
    //
    //$provide.decorator('mwlCalendarMonthDirective', function ($delegate) {
    //  let directive = $delegate[0];
    //  directive.template = '';
    //  directive.templateUrl = 'calendar.month.view';
    //  directive.require = '^vncCalendar';
    //  return $delegate;
    //});
    //
    //$provide.decorator('mwlCalendarWeekDirective', function ($delegate) {
    //  let directive = $delegate[0];
    //  directive.template = '';
    //  directive.templateUrl = 'calendar.week.view';
    //  directive.require = '^vncCalendar';
    //
    //  let scopeExtension = {
    //    isShowWorkWeek: '=',
    //    onTimeSlotClick: '='
    //  };
    //
    //  angular.forEach(scopeExtension, (value, key)=> {
    //    directive.$$isolateBindings[key] = {
    //      attrName: key,
    //      mode: value,
    //      optional: true
    //    };
    //  });
    //
    //  let compile = directive.compile;
    //
    //  directive.compile = function (tElement, tAttrs) {
    //    var link = compile.apply(this, arguments);
    //    return function (scope, elem, attrs) {
    //      link.apply(this, arguments);
    //
    //      angular.forEach(scopeExtension, (value, key)=> {
    //        scope.vm[key] = scope[key];
    //      });
    //    };
    //  };
    //
    //  return $delegate;
    //});
    //
    //$provide.decorator('mwlCalendarDayDirective', function ($delegate) {
    //  let directive = $delegate[0];
    //  directive.template = '';
    //  directive.templateUrl = 'calendar.day.view';
    //  directive.require = '^vncCalendar';
    //
    //  let scopeExtension = {
    //    calendarFolderList: '=',
    //    onTimeSlotClick: '='
    //  };
    //
    //  angular.forEach(scopeExtension, (value, key)=> {
    //    directive.$$isolateBindings[key] = {
    //      attrName: key,
    //      mode: value,
    //      optional: true
    //    };
    //  });
    //
    //  directive.compile = function (tElement, tAttrs) {
    //    return function (scope, elem, attrs) {
    //      angular.forEach(scopeExtension, (value, key)=> {
    //        scope.vm[key] = scope[key];
    //      });
    //
    //      scope.$on('calendar.refreshView', function() {
    //        angular.forEach(scopeExtension, (value, key)=> {
    //          scope.vm[key] = scope[key];
    //        });
    //      });
    //    };
    //  };
    //
    //  return $delegate;
    //});
    //
    //$provide.decorator('mwlCalendarHourListDirective', function ($delegate) {
    //  let directive = $delegate[0];
    //  directive.template = '';
    //  directive.templateUrl = 'calendar.hour.list';
    //  return $delegate;
    //});
    //
    //$provide.decorator('mwlCalendarSlideBoxDirective', function ($delegate) {
    //  let directive = $delegate[0];
    //  directive.template = '';
    //  directive.templateUrl = 'calendar.slide.box';
    //  return $delegate;
    //});
  }])
  .config(['calendarConfigProvider', function (calendarConfigProvider) {
    calendarConfigProvider.showTimesOnWeekView(true);
  }])
  .directive('app', AppComponent)
  .filter('user', function () {
    return function (input) {
      let email = input;
      let indexOfChar = email.indexOf('@');
      email = email.substring(0, indexOfChar != -1 ? indexOfChar : email.length);
      return email;
    };
  })
  .filter('bytes', function() {
    return function(bytes, precision) {
      if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) {
        return '-';
      }

      if (typeof precision === 'undefined') {
        precision = 1;
      }

      var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
        number = Math.floor(Math.log(bytes) / Math.log(1024));

      return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
    }
  });

export default AppModule;
