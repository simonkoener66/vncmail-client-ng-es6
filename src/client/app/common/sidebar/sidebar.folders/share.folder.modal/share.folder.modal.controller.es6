class ShareFolderController {
  /* @ngInject */
  constructor( logger, $mdDialog, mailService, data, auth, $rootScope, sidebarFoldersService, hotkeys) {
    var vm = this;
    vm.details = (typeof data == 'string') ? JSON.parse(data) : data;
    if( vm.details && vm.details.$){
      vm.oldName = vm.details.$.name;
      vm.folderName = angular.copy(vm.details.$.name);
      vm.folderId = vm.details.$.id;
    }

    vm.form1 = true;
    vm.form2 = false;
    vm.form3 = false;
    vm.errorMessage ='';
    vm.duplicateAddress ='';
    vm.reqPending = false;
    vm.toEmails = [];
    vm.next = () =>{
      vm.external = vm.sharewith == 'guest';
      vm.form1 = false;
      vm.form2 = true;
    };

    if(vm.details.share){
      vm.form1 = false;
      vm.form2 = true;
      vm.shareRole = vm.details.share.granteeRole;
      vm.sharewith = vm.details.share.granteeType;
      vm.toEmails.push(vm.details.share.granteeEmail);
    }

    vm.$mdDialog = $mdDialog;
    vm.mailService = mailService;
    vm.logger = logger;
    vm.auth = auth;
    vm.$rootScope = $rootScope;
    vm.sidebarFoldersService = sidebarFoldersService;
    /* add hotkeys */
    hotkeys.add({
      combo: ['enter', 'space'],
      callback: function( ) {
        vm.next()
      }
    });

    hotkeys.add({
      combo: ['esc'],
      callback: function( ) {
      vm.cancel()
      }
    });
  };

  share(){
    let vm = this;
    vm.emailInfo = [];
    if (vm.toEmails.length > 0 && vm.details.share) {
      for (let toEmail of vm.toEmails) {
        vm.emailInfo.push(toEmail.name);
      }
    }
    else if (vm.toEmails.length > 0) {
      for (let toEmail of vm.toEmails) {
        vm.emailInfo.push(toEmail.email);
      }
    }
    let request = {
      id: vm.folderId,
      emailInfo: vm.auth.userEmail,
      op: 'grant',
      gt: vm.sharewith,
      d:  vm.emailInfo,
      perm:  vm.shareRole != 'n' ? vm.shareRole : "",
      pw: ''
    };
    vm.reqPending = true;
    vm.mailService.shareFolder(request, function( res, err ){
      if(err){
        vm.reqPending = false;
        err.msg = err.msg.toLowerCase();
        let duplicateError = 'grantee already exists',
          selfShareError = 'cannot grant access to the owner of the item';
        if( err.msg && err.msg.indexOf(selfShareError) > -1 ){
          vm.sidebarFoldersService._openCriticalErrorModel('You cannot share a folder with yourself.');
          return;
        }
        if( err.msg && err.msg.indexOf(duplicateError) > -1 ){
          vm.duplicateAddress = err.msg.split("exists ")[1];
          vm.duplicateEmail = true;
          vm.errorMessage = 'This folder has already been shared with user "'+ vm.duplicateAddress +'" with your chosen role. Click "Resend" to send the notification again.';
          vm.openErrorModel();
          vm.$mdDialog.hide();
        }
        else{
          vm.logger.error(err.msg);
        }
      }
      else{
        vm.$rootScope.$broadcast('Sharing Changed',vm.details.$.id);
        vm.$rootScope.$broadcast('folder-added');
        // vm.logger.success('Share Created');
        if(vm.shareType == 'no'){
          vm.$mdDialog.hide();
        }
        else{
          let options = {
            id: vm.folderId,
            emailInfo: vm.emailInfo,
            notes: vm.notes
          };
          vm.$mdDialog.hide();
          vm.mailService.sendShareFolderRequest(options, function( res, err ){
            if(err){
              vm.logger.error(err.msg);
            }
          });
        }
      }
    });
  };

  openErrorModel(){
    let vm = this;
    let modalInstance = vm.$mdDialog.show({

      controller: vm.shareErrorController,
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'ShareError.html',
      escapeToClose: false,
      fullscreen: true,
      resolve:{
        data: function(){
          return {
            error: vm.errorMessage,
            type: vm.duplicateEmail,
            id: vm.folderId,
            emailInfo: vm.duplicateAddress,
            notes: vm.notes,
            sendNotification: vm.sendNotification
          }
        }
      }
    })
  };

  shareErrorController($mdDialog, mailService, logger, data){
    let vm = this;
    vm.message = data.error;
    vm.duplicateEmail = data.type;
    vm.ok = () => {
      $mdDialog.cancel();
    };
    vm.resend = () =>{
      let options = {
        id: data.id,
        emailInfo: data.emailInfo,
        notes: data.notes
      };
      mailService.sendShareFolderRequest(options, function( res, err ){
        if(err){
          logger.error(err.msg);
          $mdDialog.cancel();
        }
        else{
          // logger.success('Share Created');
          $mdDialog.hide();
        }
      });
    };
  }

  cancel(){
    this.$mdDialog.cancel();
  }
}

export default ShareFolderController;
