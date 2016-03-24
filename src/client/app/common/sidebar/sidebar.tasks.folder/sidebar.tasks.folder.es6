import angular from 'angular';
import sidebarTaskFolderComponent from './sidebar.tasks.folder.component';
import './_sidebar.tasks.folder.scss';

let sidebarTaskFolderModule = angular.module('sidebarTaskFolder', [])

.directive('vncTaskFolderView', sidebarTaskFolderComponent);

export default sidebarTaskFolderModule;
