import angular from 'angular';
import sidebarComponent from './sidebar.component';
import SidebarFolders from './sidebar.folders/sidebar.folders';
import SidebarDropdownButton from './sidebar.dropdown.button/dropdownButton';
import SidebarMailFolder from './sidebar.mail.folder/sidebar.mail.folder';
import SidebarContactFolder from './sidebar.contacts.folder/sidebar.contacts.folder';
import SidebarCalendarFolder from './sidebar.calendar.folder/sidebar.calendar.folder';
import SidebarTaskFolder from './sidebar.tasks.folder/sidebar.tasks.folder';
import sidebarFoldersService from './sidebar.folder.services';
import './_sidebar.scss';
// import dragNdrop from 'angular-draganddrop';

let sidebarModule = angular.module('sidebar', [
//,'draganddrop'
  SidebarFolders.name,
  SidebarMailFolder.name,
  SidebarContactFolder.name,
  SidebarCalendarFolder.name,
  SidebarTaskFolder.name,
  SidebarDropdownButton.name
])

.service('sidebarFoldersService', sidebarFoldersService)

.directive('vncSidebar', sidebarComponent);

export default sidebarModule;
