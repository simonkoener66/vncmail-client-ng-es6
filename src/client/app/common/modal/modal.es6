import angular from 'angular';
import uiBootstrapModal from './ui.bootstrap.modal/ui.bootstrap.modal.es6';
import modalComponent from './modal.component.es6';
import './_modal.scss';

let ModalModule = angular.module('modal', [
    uiBootstrapModal.name
])

.directive('vncModal', modalComponent);

export default ModalModule;
