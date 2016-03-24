class MailRedirectController {
  /* @ngInject */
  constructor($mdDialog, mailService, logger, id) {

    let vm = this;
    vm.toEmails = [];
    vm.ok = () => {
      if(vm.toEmails.length){
        let request = {
          id: id
        };
        request.e = vm.toEmails.map(function(mail){
            return {a: mail.email, t: "t"}
        });
        mailService.bounceMsg(request, function(res){
          if(res){
            // logger.success('The message has been redirected');
            $mdDialog.hide();
          }
          else logger.error('There is an error in redirecting message');
        })
      }
      else logger.error('Please select at-least one email address');
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }

}

export default MailRedirectController;
