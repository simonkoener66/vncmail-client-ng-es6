import angular from 'angular';
import headerComponent from './header.component';
import angularTranslate from 'angular-translate';
import angularTranslateLoader from 'angular-translate-loader-static-files';
import './_header.scss';
import 'angular-hotkeys';

let headerModule = angular.module('header', ['pascalprecht.translate'])

.directive('vncHeader', headerComponent)
.config(['$translateProvider', function($translateProvider) {
    $translateProvider.useStaticFilesLoader({
      prefix: 'languages/',
      suffix: '.json'
    });
    $translateProvider.registerAvailableLanguageKeys(['de', 'en', 'fr', 'it'], {
        'en-US': 'en',
        'en-UK': 'en',
        'de-DE': 'de',
        'de-CH': 'de',
        'fr-FR': 'fr',
        'it-IT': 'it',
    });

    $translateProvider.uniformLanguageTag('bcp47');
    $translateProvider.fallbackLanguage('de');
    $translateProvider.preferredLanguage('de');
  }]);
export default headerModule;
