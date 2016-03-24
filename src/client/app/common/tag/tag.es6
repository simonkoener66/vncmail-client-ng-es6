import angular from 'angular';
import tagComponent from './tag.component';
import CreateNewTagController from './create.new.tag/create.new.tag.controller';
import SidebarService from '../services/sidebar.service/sidebar.service'
import tagService from './tag.service.es6'
import './_tag.scss';
import './create.new.tag/_create.new.tag.scss';

let TagModule = angular.module('tag', [SidebarService.name])

.controller('CreateNewTagController', CreateNewTagController)

.service('tagService', tagService)

.directive('vncTag', tagComponent);

export default TagModule;
