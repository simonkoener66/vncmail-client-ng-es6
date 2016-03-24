import angular from 'angular';
import resizeHeaderComponent from './resizeHeader.component';

let resizeHeaderModule = angular.module('resizeHeader', [])

.directive('vncResizeHeader', resizeHeaderComponent);

export default resizeHeaderModule;
