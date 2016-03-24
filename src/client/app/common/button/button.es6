import angular from 'angular';
import buttonComponent from './button.component';
import './_button.scss';

let buttonModule = angular.module('button', [])

.directive('vncButton', buttonComponent);

export default buttonModule;
