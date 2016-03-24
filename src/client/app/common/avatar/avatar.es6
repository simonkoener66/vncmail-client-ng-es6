import angular from 'angular';
import avatarComponent from './avatar.component';
import './_avatar.scss';

let avatarModule = angular.module('avatar', [])

.directive('vncAvatar', avatarComponent);

export default avatarModule;
