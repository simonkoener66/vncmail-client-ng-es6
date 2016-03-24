import angular from 'angular';
import hamburgerComponent from './hamburger.component';
import './_hamburger.scss';

//inject sub module of hamburger
let hamburgerModule = angular.module('hamburger', [])

.directive('hamburgerToggle', hamburgerComponent);

export default hamburgerModule;
