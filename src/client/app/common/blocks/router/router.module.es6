import angular from 'angular';
import uiRouter from 'angular-ui-router';
import loggerModule from '../logger/logger.module';
import routerHelperProvider from './router-helper.provider';

let RouterModule = angular.module('blocks.router', [
    uiRouter, loggerModule.name
])

.provider('routerHelper', routerHelperProvider);

export default RouterModule;
