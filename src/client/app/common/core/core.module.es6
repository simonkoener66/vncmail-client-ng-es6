import angular from 'angular';
import angularMoment from 'angular-moment';
import ngAnimate from 'angular-animate';
import ngAria from 'angular-aria';
import ngMessages from 'angular-messages';
import ngMaterial from 'angular-material';
import ngSanitize from 'angular-sanitize';
import uiRouter from 'angular-ui-router';
import ngCookies from 'angular-cookies';
import moment from 'moment';
import lodash from 'lodash';
import blocks from '../blocks/block.module';
import jstimezonedetect from 'jstimezonedetect';
let coreModule = angular.module('core.app', [
    'angularMoment', ngAnimate, ngSanitize, uiRouter, ngCookies, blocks.name, ngMaterial
  ])

  .constant('lodash', lodash)
  .constant('moment', moment)
  .constant('jstimezonedetect', jstimezonedetect)
/* @ngInject */
.directive('autofocus', ($timeout) => {
  return {
    restrict: 'A',
    /* @ngInject */
    link: function ($rootScope, $element) {
      $timeout(function () {
        $element[0].focus();
      }, 200);
    }
  };
});

export default coreModule;
