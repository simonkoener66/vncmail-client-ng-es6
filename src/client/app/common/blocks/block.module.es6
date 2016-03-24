import angular from 'angular';
import ngAnimate from 'angular-animate';
import ngSanitize from 'angular-sanitize';
import uiRouter from 'angular-ui-router';
import exceptionModule from './exception/exception.module';
import loggerModule from './logger/logger.module';
import RouterModule from './router/router.module';


let blockModule = angular.module('block', [
    ngAnimate,
    ngSanitize,
    uiRouter,
    exceptionModule.name,
    loggerModule.name,
    RouterModule.name
]);

export default blockModule;
