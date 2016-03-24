/* jshint -W104, -W119 */
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import loginComponent from './home.component';
import coreModule from '../../common/core/core';
import './_home.scss';

let homeModule = angular.module('home', [
    uiRouter,
    coreModule.name
])

.run(appRun)

.directive('home', loginComponent);

appRun.$inject = ['routerHelper'];

/* @ngInject */
function appRun( routerHelper ) {
    'ngInject';
    routerHelper.configureStates(getStates());
}

function getStates() {
    return [
        {
            state: 'home',
            config: {
                url: '/',
                template: '<home></home>',
                title: 'Home'
            }
        }
    ];
}
export default homeModule;
