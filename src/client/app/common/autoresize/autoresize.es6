import angular from 'angular';
import autoResizeComponent from './autoresize.component';

let autoResizeModule = angular.module('autoResize', [])

.directive('vncAutoResize', autoResizeComponent);

export default autoResizeModule;
