import angular from 'angular';
import sidemenuComponent from './sidemenu.component';
import './_sidemenu.scss';

let sidemenuModule = angular.module('sidemenu', [])

.directive('vncSidemenu', sidemenuComponent);

export default sidemenuModule;
