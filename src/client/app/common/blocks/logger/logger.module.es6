import angular from 'angular';
import logger from './logger.component';

let loggerModule = angular.module('blocks.logger', [])

.factory('logger', logger);

export default loggerModule;
