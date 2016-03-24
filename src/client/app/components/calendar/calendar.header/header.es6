import headerComponent from './header.component';

let headerMoudule = angular.module('calendar.header', [])
  .directive('vncCalendarToolbarHeader', headerComponent);

export default headerMoudule;
