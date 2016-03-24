class MailController {
  /* @ngInject */
  constructor(logger, sidebarService, mailService) {
    // sets default label for the sidebar dropdown button for Mail state
    sidebarService.state = 'mail';

    var vm = this;
    vm.title = 'Mail';

    activate();

    function activate() {
      // let options = {
      //   op: 'grant',
      //   id: 13882,
      //   gt: 'usr',
      //   inh: 1,
      //   d: 'macanhhuydn@gmail.com',
      //   perm: 'r',
      //   notes: 'test'
      // }
      // mailService.shareFolderBatchRequest(options, function(res){
      //   console.log('shareFolderBatchRequest', res);
      // });

      // mailService.getFolderBatchRequest([5,13524,13283,13284,6,4], function(res){
      //   console.log('getFolderBatchRequest', res);
      // });

      // mailService.getShareInfoBatchRequest(['hemant@zuxfdev.vnc.biz', 'macanh.huy@vnc.biz'], function(res){
      //   console.log('getShareInfoBatchRequest', res);
      // });
      // logger.info('Activated Mail View');
    }
  }
}

export default MailController;

MailController.$inject = ['logger', 'sidebarService', 'mailService']
