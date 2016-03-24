import angular from 'angular';
import contactPopupComponent from './contactPopup.component';

let contactPopupModule = angular.module('contactPopup', [])
  .directive('contactPopup', contactPopupComponent);

export default contactPopupModule;
