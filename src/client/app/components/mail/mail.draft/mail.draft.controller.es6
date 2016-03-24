class MailDraftController {
  /*@ngInject*/
  constructor( vncConstant, auth ){
    // initialization
    let vm = this;
    vm.auth = auth;
    vm.mail = {
      showBy: 'receiver',
      queryBy: vncConstant.SEARCH_CRITERIA.IN_DRAFTS,
      currentFolder : 'Drafts',
      folderId : vncConstant.FOLDERID.DRAFTS
    }
  }
}


export default MailDraftController;
