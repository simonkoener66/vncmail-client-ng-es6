import angular from 'angular';
import coreModule from './core.module';

let coreRouteComponent = angular.module('core.app')

.run(appRun);

appRun.$inject = ['routerHelper'];
/* @ngInject */

function appRun( routerHelper ) {
   "ngInject";
    var otherwise = '/mail/inbox';
    routerHelper.configureStates(getStates(), otherwise);
}

function getStates() {
    return [
        {
            state: '404',
            config: {
                url: '/404',
                templateUrl: 'app/common/core/404.html',
                title: '404'
            }
        }
    ];
}

export default coreRouteComponent;
