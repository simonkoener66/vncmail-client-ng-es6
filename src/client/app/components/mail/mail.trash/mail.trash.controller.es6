class SentController {
    /*@ngInject*/
  constructor( vncConstant, auth ) {
    // initialization
    let vm = this;
    vm.auth = auth;
    vm.mail = {
      showBy: 'sender',
      queryBy: vncConstant.SEARCH_CRITERIA.IN_TRASH,
      currentFolder : 'Trash',
      folderId : vncConstant.FOLDERID.TRASH
    }
  }
}

export default SentController;
