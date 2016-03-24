class AvatarController {
    /* @ngInject */
    constructor( config, mailService, vncConstant, lodash ) {
        let vm = this;
        vm.name = vm.name || '';
        vm.lodash = lodash;
        vm.mailService = mailService;
        vm.vncConstant = vncConstant;
        vm.email = vm.email || '';

        if ( vm.name !== '' ) {
          let temp = vm.name.split(' ');
          temp[0] && (vm.shortName = temp[0].charAt(0));
          temp[1] && (vm.shortName += temp[1].charAt(0));
        }
        else {
          vm.shortName = vm.email.substr(0, 2).toUpperCase();
        }
        if ( angular.isDefined(vm.shortName) ) {
          vm.bgAvatar = vncConstant.USER_PALETTE[vm.shortName.substr(0,1).toLocaleUpperCase()];
        }

        //var basePath = config.imageBasePath;
        //var unknownImage = config.unknownPersonImageSource;
        // set size for avatar image



        function getSenderInfo(address) {
          if (angular.isDefined(address.$) && angular.isDefined(address.a)) {
            let contactInfo =  address.$;
            let foundAvatar = false;

            _.some(address.a, function(data){
                if ( data.$.n === 'image') {
                  foundAvatar = true;
                  return foundAvatar;
                }
            });

            if ( foundAvatar ) {
              vm.image = vm.vncConstant.ZimbraAPI + '/getAvatar?user_id=' + contactInfo.id;
              let fullName = contactInfo.fileAsStr.split(', ').map(function(data){ return data.toLowerCase();});
              let fullNameArray = vm.lodash(fullName).reverse().value();

              if (fullNameArray.join(' ').length > 25) {
                let firstName = fullNameArray[0].substr(0, 1);
                delete fullNameArray[0];
                vm.fullName = firstName + fullNameArray.join(' ');
              }
              else {
                vm.fullName = fullNameArray.join(' ');
              }
              return true;
            }
            else {
              let fullName = contactInfo.fileAsStr.split(', ').map(function(data){ return data.toLowerCase();});
              let fullNameArray = vm.lodash(fullName).reverse().value();
            }
          }
        }

        if ( vm.email !== '' ) {
            let request= {
              'query': vm.email,
              'sortBy': 'nameAsc',
              'types': 'contact'
            };
            vm.mailService.searchRequest(request, function(res){
                if (angular.isDefined(res.cn)) {
                  _.some(res.cn, function(address){
                    return getSenderInfo(address);
                  });
                }
            });
        }
    }

    applySize() {
      var vm = this;
        switch(vm.size){
            case'xs':
                return 'avatar-xs';
                break;
            case'sm':
                return 'avatar-sm';
                break;
            case'md':
                return 'avatar-md';
                break;
            case'lg':
                return 'avatar-lg';
                break;
            default:
                return 'avatar-md';
                break;
        }
    }
}

export default AvatarController;
