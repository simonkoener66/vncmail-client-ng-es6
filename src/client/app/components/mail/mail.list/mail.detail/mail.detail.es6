import angular from 'angular';
import uiRouter from 'angular-ui-router';
import mailDetailComponent from './mail.detail.component';
import 'angular-hotkeys';

let mailDetailModule = angular.module('mail.detail', [
    uiRouter
])

.directive('vncMailDetail', mailDetailComponent);

export default mailDetailModule;
