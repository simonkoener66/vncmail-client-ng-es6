class MailFolderController {
  /*@ngInject*/
  constructor( auth, $stateParams ) {
    // initialization
    let vm = this;
    vm.auth = auth;
    $stateParams.name = $stateParams.name.replace(/%2F/g,"/");
    vm.mail = {
      showBy: 'sender',
      queryBy: 'in:"' + $stateParams.name + '"',
      currentFolder : 'Folder',
      folderId: $stateParams.id
    };
  }
}

export default MailFolderController;
