import angular from 'angular';
import ngplus from '../blocks/ngplus-overlay/ngplus-overlay.js';
import coreAppModule from './core.module';
import coreRoute from './core.route';
import coreConfig from './core.config';
import coreDataService from './core.dataService';
import authService from './auth.service';
import mailService from './mail.service';
import contactService from '../core/extends/contact.service.es6';
import taskService from '../core/extends/task.service.js';
import folderService from '../core/extends/folder.service.js';
import calendarService from '../core/extends/calendar.service.js';
import preferenceService from './preference.service';

let coreModule = angular.module('core', [
    coreAppModule.name
]);

export default coreModule;
