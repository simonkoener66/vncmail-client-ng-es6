class MailJunkController {
    /*@ngInject*/
    constructor( vncConstant, auth ) {
      // initialization
      let vm = this;
      vm.auth = auth;
      vm.mail = {
        showBy: 'sender',
        queryBy: vncConstant.SEARCH_CRITERIA.IN_JUNK,
        currentFolder : 'Junk',
        folderId : vncConstant.FOLDERID.JUNK
      }
    }
}

export default MailJunkController;
