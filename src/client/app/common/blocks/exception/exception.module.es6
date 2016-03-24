import angular from 'angular';
import exception from './exception';
import exceptionHandlerProvider from './exception-handler.provider';
import configComponent from './config';
import loggerModule from '../logger/logger.module';

let exceptionModule = angular.module('blocks.exception', [
    loggerModule.name
])

.factory('exception', exception)
.provider('exceptionHandler', exceptionHandlerProvider)
.config(configComponent);

export default exceptionModule;
