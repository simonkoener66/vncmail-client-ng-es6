import angular from 'angular';
import uiRouter from 'angular-ui-router';
import coreModule from './core.module';

let authService = angular.module('core.app')
.service('auth', auth)
.service('AuthService', auth)
.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized',
  loggedOut: 'auth-logged-out',
  changePasswordSuccess: 'auth-change-password-success'
});

auth.$inject = ['$q', '$http', '$rootScope', '$state', '$cookies', 'vncConstant', 'logger', 'AUTH_EVENTS', '$interval', '$location'];
/* @ngInject */
function auth($q, $http, $rootScope, $state, $cookies, vncConstant, logger, AUTH_EVENTS, $interval, $location) {
  let service = {
            'API_URL': '',
            // Set use_session to false to store the security token locally and transmit it as a custom header.
            'use_session': true,
            /* END OF CUSTOMIZATION */
            'authenticated': null,
            'authPromise': null,
            'request': function (args) {
                // Let's retrieve the token from the cookie, if available
                if ($cookies.get('ZM_AUTH_TOKEN')) {
                    $http.defaults.headers.common.Authorization = $cookies.get('ZM_AUTH_TOKEN');
                }
                // Continue
                params = args.params || {};
                args = args || {};
                var deferred = $q.defer(),
                    url = vncConstant.ZimbraAPI + args.url,
                    method = args.method || 'GET',
                    params = params,
                    data = args.data || {};

                    // Fire the request, as configured.
                    $http({
                        url: url,
                        withCredentials: this.use_session,
                        method: method.toUpperCase(),
                        params: params,
                        data: data
                    })
                    .success(angular.bind(this, function (data, status, headers, config) {
                        deferred.resolve(data, status);
                    }))
                    .error(angular.bind(this, function (data, status, headers, config) {
                        //console.log('error syncing with: ' + url);
                        //$state.go('login');

                        // Set request status
                        if (data) {
                            data.status = status;
                            $rootScope.$broadcast(AUTH_EVENTS.loginFailed, data);
                        }
                        if (status === 0) {
                            if (data === '') {
                                data = {};
                                data['status'] = 0;
                                data['non_field_errors'] = ['Could not connect. Please try again.'];
                            }
                            // or if the data is null, then there was a timeout.
                            if (data === null) {
                                // Inject a non field error alerting the user
                                // that there's been a timeout error.
                                data = {};
                                data['status'] = 0;
                                data['non_field_errors'] = ['Server timed out. Please try again.'];
                            }
                        }
                        deferred.reject(data, status, headers, config);
                    }));
                return deferred.promise;
            },
            'login': function (username, password) {

                var zimbraAuth = this;
                return this.request({
                    'method': 'POST',
                    'url': '/authToken',
                    'data': {
                        'username': username,
                        'password': password
                    }
                }).then(function (data) {
                    if (!zimbraAuth.use_session) {
                        $http.defaults.headers.common.Authorization = data.authtoken;
                        localStorage.setItem('ZM_AUTH_TOKEN', data.authtoken);
                    }

                    if (data.authtoken) {
                      $cookies.put('ZM_AUTH_TOKEN', data.authtoken, {'path':'/'});
                      $cookies.put('ZM_AUTH_TOKEN', data.authtoken, {'path':'/api'});
                    }
                    zimbraAuth.authenticated = true;
                    zimbraAuth.user = data;
                    zimbraAuth.userEmail = data.name;
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, data);
                });
            },
            'logout': function () {
                var zimbraAuth = this;
                return this.request({
                    'method': 'POST',
                    'url': '/logout'
                }).then(function (data) {
                    delete $http.defaults.headers.common.Authorization;
                    $cookies.remove('ZM_AUTH_TOKEN');
                    localStorage.removeItem('ZM_AUTH_TOKEN');
                    zimbraAuth.authenticated = false;
                    $rootScope.$broadcast(AUTH_EVENTS.loggedOut);
                });
            },
            'getContacts': function (cb) {
                return this.request({
                    'method': 'GET',
                    'url': '/getContacts'
                }).then(cb);
            },
            'authenticationStatus': function (groups, restrict, force) {
                // Set restrict to true to reject the promise if not logged in
                // Set to false or omit to resolve when status is known
                // Set force to true to ignore stored value and query AP
                restrict = restrict || false;
                force = force || false;
                if (this.authPromise === null || force) {
                    this.authPromise = this.request({
                        'method': 'GET',
                        'url': '/getInfo'
                    });
                }
                var zimbraAuth = this;
                var getAuthStatus = $q.defer();
                if (this.authenticated !== null && !force) {
                    // We have a stored value which means we can pass it back right away.
                    if (this.authenticated === false && restrict) {
                        getAuthStatus.reject('User is not logged in.');
                        $state.go('login');
                    } else {
                        getAuthStatus.resolve();
                    }
                } else {
                    // There isn't a stored value, or we're forcing a request back to
                    // the API to get the authentication status.
                    this.authPromise.then(function (data) {

                        if (localStorage.getItem('ZM_AUTH_TOKEN')) {
                          $cookies.put('ZM_AUTH_TOKEN', localStorage.getItem('ZM_AUTH_TOKEN'), {'path':'/'});
                          $cookies.put('ZM_AUTH_TOKEN', localStorage.getItem('ZM_AUTH_TOKEN'), {'path':'/api'});
                        }

                        zimbraAuth.authenticated = true;
                        zimbraAuth.user = data;
                        zimbraAuth.userEmail = data.name;
                        $rootScope.auth = zimbraAuth;
                        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, data);
                        $location.path('/mail/inbox');
                        getAuthStatus.resolve();
                    }, function () {
                        zimbraAuth.authenticated = false;
                        $state.go('login');
                        if (restrict) {
                            getAuthStatus.reject('User is not logged in.');
                            $state.go('login');
                        } else {
                            getAuthStatus.resolve();
                        }
                    });
                }
                return getAuthStatus.promise;
            },
            'initialize': function (url, sessions) {
                this.API_URL = url;
                this.use_session = sessions;
                return this.authenticationStatus();
            },
            'getInfo': function (callback) {
                console.info('getInfo');
                this.authenticationStatus();

            }

        };
        return service;
}

export default authService;
