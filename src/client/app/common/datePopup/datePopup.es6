import angular from 'angular';
import datePopupComponent from './datePopup.component';

let datePopupModule = angular.module('datePopup', [])
  .directive('datePopup', datePopupComponent);

export default datePopupModule;
