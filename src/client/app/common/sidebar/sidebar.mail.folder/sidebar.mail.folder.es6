import angular from 'angular';
import sidebarMailFolderComponent from './sidebar.mail.folder.component';
import './_sidebar.mail.folder.scss';

let SidebarMailFolderModule = angular.module('sidebarMailFolder', [])

.directive('vncMailFolderView', sidebarMailFolderComponent);

export default SidebarMailFolderModule;
