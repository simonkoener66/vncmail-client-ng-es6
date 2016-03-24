import importTemplate from './preferences.import/preferences.import.html';
class PreferencesController {
    /* @ngInject */
    constructor( logger, auth, mailService ) {

      //data initialization
      var vm = this;
      vm.title = 'Preferences';
      vm.importTemplate = importTemplate;
      vm.mailService = mailService;
      vm.auth = auth;
      activate();

      function activate() {
        // logger.info('Activated Preferences View');
        vm.savePreferences();
        vm.cancelPreferences();
      }
    }

    savePreferences() {
      var vm = this;
       let preferences = [
                    { key: 'zimbraPrefDefaultPrintFontSize', value: '14pt'},
                    { key: 'zimbraPrefFont', value: 'modern'},
                    { key: 'zimbraPrefShowComposeDirection', value: 'TRUE'}
                    ];
       vm.mailService.savePreferences(preferences, function(res){
        console.info('Saved');
      });
    }

    cancelPreferences() {
        var vm = this;
         vm.mailService.getPreferences(null, function(res){
          console.log('getPreferences', res);
        });
    }
}

export default PreferencesController;
