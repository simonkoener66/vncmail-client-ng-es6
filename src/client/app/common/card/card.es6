import angular from 'angular';
import cardComponent from './card.component';
import cardAction from './card.action/card.action';
import './_card.scss';

//inject sub module of card
let cardModule = angular.module('vncCard', [
    cardAction.name
])

.directive('vncCard', cardComponent);

export default cardModule;
