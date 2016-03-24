import shareTemplate from './share.folder.modal/share.folder.modal.html';
import emptyTemplate from './empty.trash/empty.trash.html';
import createTemplate from './create.new.folder/create.new.folder.html';
import editPropertiesTemplate from './edit.properties/edit.properties.html';
import deleteTemplate from './delete.folder.modal/delete.folder.modal.html';
import renameTemplate from './rename.folder.modal/rename.folder.modal.html';
import MoveUserFolderTemplate from './move.user.folder/move.user.folder.html';


class SidebarFoldersController {
    /* @ngInject */
    constructor( mailService, $scope, vncConstant, $rootScope, logger, $state ) {

      // initialization
      var vm = this;
      vm.share = {show: false, size: 'sm', items: [
        { name: "Share Folder" , type: "modal", template: shareTemplate, use_ctrl: 'ShareFolderController', backdrop: 'static'},
        { name: "Rename Folder", type: "modal", template: renameTemplate, use_ctrl: 'RenameFolderController'},
        { name: "Mark All as Read", type: "function", itemFunction: markAllReadInFolder},
        { name: "Delete", type: "modal", template: deleteTemplate, use_ctrl: 'DeleteFolderController'},
        { name: "Move Folder", type: "modal", template: MoveUserFolderTemplate, use_ctrl: 'moveFolderController'},
        { name: "Create new folder", type: "modal", template: createTemplate, use_ctrl: 'CreateNewFolderController', backdrop: 'static'},
        { name: "Edit Properties", type: "modal", template: editPropertiesTemplate, use_ctrl: 'EditPropertiesFolderController', backdrop: 'static'},
        { name: "Empty Folder", type: "modal", template: emptyTemplate, use_ctrl: 'emptyFolderController'}
      ]
      };

      vm.state = $state;
      vm.$rootScope = $rootScope;
      vm.vncConstant = vncConstant;
      vm.logger = logger;
      vm.mailService = mailService;

      //show options depended on folders
      vm.selectFolder = ( index, item ) => {
        let folderName = item.$.name.toUpperCase();
        vm.share.items[vm.share.items.length - 1].disabled = false;
        if(folderName == 'TRASH'){
          vm.share.items[vm.share.items.length - 1].name = 'Empty Trash';
          vm.share.items[vm.share.items.length - 1].disabled = !(Number(item.$.s) || (item.folder && item.folder.length));
        }
        else if(folderName == 'JUNK'){
          vm.share.items[vm.share.items.length - 1].name = 'Empty Junk';
          vm.share.items[vm.share.items.length - 1].disabled = !(Number(item.$.s) || (item.folder && item.folder.length));
        }
        else if(vncConstant.FOLDERID[folderName]){
          vm.share.items[vm.share.items.length - 1].name = 'Empty Folder';
          vm.share.items[vm.share.items.length - 1].disabled = true;
        }
        else{
          vm.share.items[vm.share.items.length - 1].name = 'Empty Folder';
          vm.share.items[vm.share.items.length - 1].disabled = !(Number(item.$.s) || (item.folder && item.folder.length));
        }
        disableFolderMenu(item);
      };

      $scope.$on('expand-folder', function(){
        angular.forEach(vm.folders, function(folder){
          folder.collapse = false;
        });
      });

      function disableFolderMenu ( folder ){
        let name = folder.$.name.toUpperCase();
        let TJFolders = ['TRASH', 'JUNK'];
        for( var i = 0; i < vm.share.items.length; i++){
          switch (vm.share.items[i].name.toLowerCase()){
            case 'mark all as read':{
              vm.share.items[i].disabled = !Number(folder.$.u);
              break;
            }
            case 'delete':{
              vm.share.items[i].disabled = vncConstant.FOLDERID[name];
              break;
            }
            case 'move folder':{
              vm.share.items[i].disabled = vncConstant.FOLDERID[name];
              break;
            }
            case 'rename folder':{
              vm.share.items[i].disabled = vncConstant.FOLDERID[name];
              break;
            }
            case 'edit properties':{
              vm.share.items[i].disabled = TJFolders.indexOf( name ) > -1;
              break;
            }
            case 'create new folder':{
              vm.share.items[i].disabled = name == "JUNK";
              break;
            }
            case 'share folder':{
              vm.share.items[i].disabled = TJFolders.indexOf( name ) > -1;
              break;
            }
          }
        }
      }

      function markAllReadInFolder( item, data ){
        let vm = this;
        vm.details = (typeof data == 'string') ? JSON.parse(item) : data;
        if(vm.details && vm.details.$){
          if(!vm.details.$.u){
            logger.error("No unread Message in this Folder");
            return;
          }
          mailService.makeFolderAction( vm.details.$.id ,'read' , function( res, err){
            if (err) logger.error(err.msg);
            if (res) {
              item.details.$.u = '0';
              $rootScope.$broadcast('event:markAllAsRead', vm.details.$.name);
            }
          });
        }
      }
    };

    getColor(number){
        return number ? this.vncConstant.COLOR_CODES[number].toLowerCase() : 'dark-grey';
    };
}

export default SidebarFoldersController;
