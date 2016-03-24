/*jshint -W104 */
/*jshint -W119 */
/*jshint -W101 */
/*jshint -W089 */
import uiRouter from 'angular-ui-router';
import coreModule from './core.module';

let preferenceService = angular.module('core.app')
.service('preferenceService', preference);

/* @ngInject */
function preference($q, $http, $rootScope, logger, $log, mailService){

    //update Preferences for currentUser//
    this.allUserPreferences = [];
    let that = this;
    this.updatePreferences = function(callback) {
      mailService.getPreferences(null, function(res){
        that.allUserPreferences = res
        callback(res);
      });
    }
    /**
     * The service to import
     *
     * @param {file} file - Attachment
     */
    mailService.getPreferences(null, function(res){
      that.allUserPreferences = res
    });
    this.importContacts = function (file, email, destination, callback) {
        var fd = new FormData();
        var request = options || {};
        fd.append('file', file);
        fd.append('destination', destination);
        fd.append('email', email);

        $http.post($rootScope.API_URL + '/importContacts', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(res){
            if (typeof callback === 'function') {
                callback(res.replace('200,\'null\',', ''), null);
            }
        })
        .error(function(res){
            if (typeof callback === 'function') {
                callback(null, res);
            }
        });
    };

    /**
     * The service to import
     *
     * @param {object} options -
     */
    this.createSignature = function (options, callback) {
        let defaultOptions = {
              content: '',
              type: 'text/plain',
              name: ''
          };

        let request = angular.extend({}, defaultOptions, options);
        return $http({
              url: $rootScope.API_URL + '/createSignature',
              method: 'POST',
              data: request
          }).success(function (res) {
            callback(res);
          }).error(function (res) {
              if (typeof callback === 'function') {
                  callback(res);
              }
          });
    };


}
