class preferencesContactsController {
  /* @ngInject */
  constructor( preferenceService, mailService, logger) {

    var vm = this;
    vm.parseValues =(value) => {
      return Boolean(value == 'TRUE');
    }

    vm.initializeValues = () => {
      //initialize values from serevr
      for(let i in preferenceService.allUserPreferences){
        switch(preferenceService.allUserPreferences[i]['key']){
          case 'zimbraPrefAutoAddAddressEnabled':
            vm.addContact = vm.parseValues(preferenceService.allUserPreferences[i]['value']);
            break;
          case 'zimbraPrefGalSearchEnabled':
            vm.initialSearch = vm.parseValues(preferenceService.allUserPreferences[i]['value']);
            break;
          case 'zimbraPrefGalAutoCompleteEnabled':
            vm.includeGlobalAddress = vm.parseValues(preferenceService.allUserPreferences[i]['value']);
            break;
          case 'zimbraPrefSharedAddrBookAutoCompleteEnabled':
            vm.includesAddresses = vm.parseValues(preferenceService.allUserPreferences[i]['value']);
            break;
          case 'zimbraPrefAutoCompleteQuickCompletionOnComma':
            vm.autoCompleteComma = vm.parseValues(preferenceService.allUserPreferences[i]['value']);
            break;
          default : break;
        }
      }
    };

    //initialize values when controller loaded
    vm.initializeValues();

    vm.savePreferences = function(){
      let request = [
        {'key': 'zimbraPrefAutoAddAddressEnabled', 'value': String(vm.addContact).toUpperCase() },
        {'key': 'zimbraPrefGalSearchEnabled', 'value': String(vm.initialSearch).toUpperCase() },
        {'key': 'zimbraPrefGalAutoCompleteEnabled', 'value': String(vm.includeGlobalAddress).toUpperCase() },
        {'key': 'zimbraPrefSharedAddrBookAutoCompleteEnabled', 'value': String(vm.includesAddresses).toUpperCase() },
        {'key': 'zimbraPrefAutoCompleteQuickCompletionOnComma', 'value': String(vm.autoCompleteComma).toUpperCase() }
      ];
      mailService.savePreferences( request,  function( res, err) {
        if(err){
          logger.error(err.msg);
        }
        else{
          preferenceService.updatePreferences(function(res){
            vm.initializeValues();
            // logger.success("Changes Successfully Updated");
          });
        }
      });
    }
  }
}

export default preferencesContactsController;
