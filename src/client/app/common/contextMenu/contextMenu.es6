import angular from 'angular';
import contextMenuComponent from './contextMenu.component';
import contextMenuDetailComponent from './contextMenu.detail/contextMenu.detail.component';
import contextItemRenderComponent from './contextMenu.detail/contextMenu.contextItemRender.component';

let contextMenuModule = angular.module('contextMenu', [])
  .directive('contextMenu', contextMenuComponent)
  .directive('contextMenuDetail', contextMenuDetailComponent)
  .directive('onFinishRender', contextItemRenderComponent);

export default contextMenuModule;
