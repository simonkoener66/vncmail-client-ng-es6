/* Help configure the state-base ui.router */
let routerHelperProvider = function ( $locationProvider, $stateProvider, $urlRouterProvider ) {
    /* jshint validthis:true */
    var config = {
        docTitle: undefined,
        resolveAlways: {}
    };

    $locationProvider.html5Mode(true);

    this.configure = function(cfg) {
        angular.extend(config, cfg);
    };

    this.$get = RouterHelper;
    RouterHelper.$inject = ['$location', '$rootScope', '$state', 'logger'];
    /* @ngInject */
    function RouterHelper($location, $rootScope, $state, logger) {
        var handlingStateChangeError = false;
        var hasOtherwise = false;
        var stateCounts = {
            errors: 0,
            changes: 0
        };

        var service = {
            configureStates: configureStates,
            getStates: getStates,
            stateCounts: stateCounts
        };

        init();

        return service;

        ///////////////

        function configureStates(states, otherwisePath) {
            states.forEach(function(state) {
                state.config.resolve =
                    angular.extend(state.config.resolve || {}, config.resolveAlways);
                $stateProvider.state(state.state, state.config);
            });
            if (otherwisePath && !hasOtherwise) {
                hasOtherwise = true;
                $urlRouterProvider.otherwise(otherwisePath);
            }
        }

        function handleRoutingErrors() {
            // Route cancellation:
            // On routing error, go to the dashboard.
            // Provide an exit clause if it tries to do it twice.
            $rootScope.$on('$stateChangeError',
                function(event, toState, toParams, fromState, fromParams, error) {
                    if (handlingStateChangeError) {
                        return;
                    }
                    stateCounts.errors++;
                    handlingStateChangeError = true;
                    var destination = (toState &&
                        (toState.title || toState.name || toState.loadedTemplateUrl)) ||
                        'unknown target';
                    var msg = 'Error routing to ' + destination + '. ' +
                        (error.data || '') + '. <br/>' + (error.statusText || '') +
                        ': ' + (error.status || '');
                    logger.warning(msg, [toState]);
                    $location.path('/mail/inbox');
                }
            );
        }

        function init() {
            handleRoutingErrors();
            updateDocTitle();
        }

        function getStates() { return $state.get(); }

        function updateDocTitle() {
            $rootScope.$on('$stateChangeSuccess',
                function(event, toState, toParams, fromState, fromParams) {
                    let tempState = toState.name.split('.');
                    stateCounts.changes++;
                    handlingStateChangeError = false;
                    var title = config.docTitle + ' ' + (toState.title || '');
                    var parentTitle = tempState[0] || '';
                    $rootScope.title = title; // data bind to <title>
                    $rootScope.parentTitle = parentTitle; // data bind to <parentTitle>
                    toState.url == fromState.url || $rootScope.$broadcast('clearHeaderSearch'); // clear header search field
                }
            );
        }
    }
};

routerHelperProvider.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider'];
/* @ngInject */

export default routerHelperProvider;
