import angular from 'angular';
import cardActionComponent from './card.action.component';
import '../_card.scss';

let cardActionModule = angular.module('cardAction', [])

.directive('cardAction', cardActionComponent);

export default cardActionModule;
