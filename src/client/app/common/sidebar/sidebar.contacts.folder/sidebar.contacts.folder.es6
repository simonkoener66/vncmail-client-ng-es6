import angular from 'angular';
import sidebarContactFolderComponent from './sidebar.contacts.folder.component';
import './_sidebar.contacts.folder.scss';

let SidebarContactFolderModule = angular.module('sidebarContactFolder', [])

.directive('vncContactFolderView', sidebarContactFolderComponent);

export default SidebarContactFolderModule;
