import angular from 'angular';
import filerepeatComponent from './file.repeat.component';
import './_file.repeat.scss';

let filerepeatModule = angular.module('fileRepeat', [])

.directive('vncFileRepeat', filerepeatComponent);

export default filerepeatModule;
