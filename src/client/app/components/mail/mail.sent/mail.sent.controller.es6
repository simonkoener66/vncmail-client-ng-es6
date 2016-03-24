class MailSentController {
  /*@ngInject*/
  constructor( vncConstant, auth ){

    // initialization
    let vm = this;
    vm.auth = auth;
    vm.mail = {
      showBy: 'receiver',
      queryBy: vncConstant.SEARCH_CRITERIA.IN_SENT,
      currentFolder : 'Sent',
      folderId : vncConstant.FOLDERID.SENT
    }
  }
}

export default MailSentController;
