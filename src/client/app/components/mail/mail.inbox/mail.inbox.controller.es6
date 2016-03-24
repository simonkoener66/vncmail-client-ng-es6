class MailInboxController {
  
  /*@ngInject*/
  constructor( vncConstant, auth ) {
    // initialization
    let vm = this;
    vm.auth = auth;
    vm.mail = {
      showBy: 'sender',
      queryBy: vncConstant.SEARCH_CRITERIA.IN_INBOX,
      currentFolder : 'Inbox',
      folderId : vncConstant.FOLDERID.INBOX
    };
  }
}

export default MailInboxController;
