import angular from 'angular';
import ngAnimate from 'angular-animate';
import ngSanitize from 'angular-sanitize';
import uiRouter from 'angular-ui-router';
import ngCookies from 'angular-cookies';
import sidebarServiceModule from './sidebar.service/sidebar.service';


let appServiceModule = angular.module('app.service', [
    ngAnimate, ngSanitize, uiRouter, ngCookies, sidebarServiceModule.name
]);

export default appServiceModule;
