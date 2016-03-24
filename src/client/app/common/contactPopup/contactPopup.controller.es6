import createNewMessageTemplate from '../../components/mail/mail.compose/mail.compose.html';


class ContactPopupController {
  /* @ngInject */
  constructor($compile, $state, logger, vncConstant, $rootScope, $interval, $uibModal) {
    var vm = this;
    vm.vncConstant = vncConstant;
    this.compile = $compile;
    this.logger = logger;
    this.$interval = $interval;
    this.$state = $state;
    this.$uibModal = $uibModal;
    this.$rootScope = $rootScope;

    if(angular.isDefined(vm.contactDetail.firstName)){
      vm.firstInitial = vm.contactDetail.firstName.charAt(0);
    } else{
      vm.firstInitial = 'N';
    }

    if(angular.isDefined(vm.contactDetail.lastName)){
      vm.lastInitial = vm.contactDetail.lastName.charAt(0);
    } else{
      vm.lastInitial = 'N';
    }

    vm.avatarInitials = vm.firstInitial+vm.lastInitial;

    if ( angular.isDefined(vm.contact) ) {
      // Get Avatar
      let contactInfo =  vm.contact.$;
      let foundAvatar = false;
      _.some(vm.contact.a, function(data){
          if (angular.isDefined(data.$) && data.$.n === 'image') {
            foundAvatar = true;
            return foundAvatar;
          }
      });

      if ( foundAvatar ) {
        vm.image = vm.vncConstant.ZimbraAPI + '/getAvatar?user_id=' + contactInfo.id;
      }
    }
  }

  compose(contact) {

    let modalInstance = this.$uibModal.open({
      template: createNewMessageTemplate,
      controller: 'MailComposeController',
      controllerAs: 'vm',
      bindToController: true,
      size: 'lg',
      windowClass: 'app-modal-window',
      backdrop: true,
      resolve: {
        data: () => {
          let emailInfo = {email: contact.email, displayName: contact.firstName + ' ' + contact.middleName + ' ' + contact.lastName};
          let emailData = {"emailData": {"sender":emailInfo,"subject":"","mailTos":[emailInfo],"mailCcTos":[],"mailBccTos":[],"sentDate":"","headerDate":"","content":{},"contentType":"text/html","plainContent":"","isCollapsed":false,"showDetail":false,"actionType":"","mailsToShow":[emailInfo],"mailsCcShow":[],"attachmentList":[],"apiUrl":"","flag":"","tags":[]}, "actionType": "NEW"};
          return JSON.stringify(emailData);
        }
      }
    });
    // var mailView = this.$interval( () => {
    //     if ( this.$state.includes('mail') ) {
    //       this.$rootScope.$broadcast('compose:event', {
    //         email: contact.email,
    //         displayName: contact.firstName + ' ' + contact.lastName
    //       });
    //       this.$interval.cancel(mailView);
    //     }
    // });

  }
}

export default ContactPopupController;
