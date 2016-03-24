import angular from 'angular';
import sidebarCalendarFolderComponent from './sidebar.calendar.folder.component';
import sidebarCalendarFolderService from './sidebar.calendar.folder.service';
import './_sidebar.calendar.folder.scss';

let SidebarCalendarFolderModule = angular.module('sidebarCalendarFolder', [])
  .directive('vncSidebarCalendarFolder', sidebarCalendarFolderComponent)
  .service('sidebarCalendarFolderService', sidebarCalendarFolderService);

export default SidebarCalendarFolderModule;
