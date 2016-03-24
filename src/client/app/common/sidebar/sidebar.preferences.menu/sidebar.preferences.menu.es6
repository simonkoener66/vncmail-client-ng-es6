import angular from 'angular';
import sidebarPreferenceComponent from './sidebar.preferences.menu.component';
import './_sidebar.preferences.menu.scss';

let sidebarPreferenceModule = angular.module('sidebarPreference', [])

.directive('vncPreferenceView', sidebarPreferenceComponent);

export default sidebarPreferenceModule;
