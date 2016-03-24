import angular from 'angular';
import angularSanitize from 'angular-sanitize';
import menuComponent from './menu.component';
import menuContentComponent from './menuContent/menuContent.component';
import menuItemRenderComponent from './menuContent/menuContent.menuItemRender.component';
import './menuContent/_menuContent.scss';

let menuModule = angular.module('menu', [
    'ngSanitize'
])

.directive('vncMenu', menuComponent)
.directive('onFinishRender', menuItemRenderComponent)
.directive('vncMenuContent', menuContentComponent);

export default menuModule;
