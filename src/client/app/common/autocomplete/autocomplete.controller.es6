class AutocompleteController {
    /* @ngInject */
    constructor($timeout, mailService, vncConstant ) {
        let vm = this;
        vm.generateTagList = generateTagList;
        vm.filterSelected = true;
        vm.vncConstant = vncConstant;
        vm.mailService = mailService;

        vm.loadEmailSuggestion = function($query) {
            vm.request = {
                name: $query || ''
            };

            return mailService.autocomplete(vm.request).then(function (response) {
                let matches = [];

                // Check if the response data return an array list
                if (angular.isArray(response.data)) {
                    if (response.data.length > 0) {
                        for (let i in response.data) {
                            matches.push(generateTagList(response.data[i].$));
                        }
                    }
                } else if (response.data.$) {
                    matches.push(generateTagList(response.data.$));
                }
                return matches;
            });
        };

       function getSenderInfo(address, match) {
          if (angular.isDefined(address.$) && angular.isDefined(address.a)) {
            let contactInfo =  address.$;
            let foundAvatar = false;

            _.some(address.a, function(data){
                if ( data.$.n === 'image') {
                  foundAvatar = true;
                  return foundAvatar;
                }
            });
            if ( foundAvatar) {
              match.image = vm.vncConstant.ZimbraAPI + '/getAvatar?user_id=' + contactInfo.id; contactInfo.id;
              return match;
            }
            else {
              return match;
            }

          }
        }

      function generateTagList(data) {
        let match = {};
        match.display = data.email.replace(/"/g, '').trim();
        match.name = data.email
          .substring(data.email.indexOf('"'), data.email.indexOf('<') - 1);
        match.name = match.name.replace(/"/g, ' ').trim();
        match.email = data.email
          .substring(data.email.indexOf('<') + 1, data.email.indexOf('>'));
        match.email = match.email.replace(/"/g, ' ').trim();
        if (match.name === '') {
          match.name = match.email;
        }
        return match;
      }
    }
}

export default AutocompleteController;
