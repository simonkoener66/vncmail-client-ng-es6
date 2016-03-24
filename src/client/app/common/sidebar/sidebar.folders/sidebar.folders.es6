import angular from 'angular';
import sidebarFoldersComponent from './sidebar.folders.component';
import CreateNewFolderController from './create.new.folder/create.new.folder.controller';
import EditPropertiesFolderController from './edit.properties/edit.properties.controller';
import RenameFolderController from './rename.folder.modal/rename.folder.modal.controller';
import DeleteFolderController from './delete.folder.modal/delete.folder.modal.controller';
import ShareFolderController from './share.folder.modal/share.folder.modal.controller';
import emptyFolderController from './empty.trash/empty.trash.controller';
import moveFolderController from './move.user.folder/move.user.folder.controller';
import './_sidebar.folders.scss';
import './create.new.folder/_create.new.folder.scss';
import './move.user.folder/_move.user.scss';
import './share.folder.modal/_share.folder.modal.scss';
import 'angular-hotkeys';

let SidebarFoldersModule = angular.module('sidebarfolders', ['cfp.hotkeys'])

.controller('CreateNewFolderController', CreateNewFolderController)

.controller('EditPropertiesFolderController', EditPropertiesFolderController)

.controller('RenameFolderController', RenameFolderController)

.controller('DeleteFolderController', DeleteFolderController)

.controller('ShareFolderController', ShareFolderController)

.controller('emptyFolderController', emptyFolderController)

.controller('moveFolderController', moveFolderController)

.directive('vncSidebarFolders', sidebarFoldersComponent)

.filter('permission', function(){
  return function(perm){
    if(angular.isDefined(perm)){
      switch(perm){
        case 'r':
          return 'Viewer';
          break;
        case 'rwidx':
          return 'Manager';
          break;
        case 'rwidxa':
          return 'Admin';
          break;
        default :
          return 'None';
          break;
      }
    }
  };
});

export default SidebarFoldersModule;
