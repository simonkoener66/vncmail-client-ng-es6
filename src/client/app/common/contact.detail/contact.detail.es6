import angular from 'angular';
import ContactDetailComponent from './contact.detail.component';
import ContactDetailContentComponent from './contact.detail.content/contact.detail.content.component';
import './contact.detail.content/_contact.detail.content.scss';

let ContactDetailModule = angular.module('ContactDetail', [])

.directive('vncContactDetail', ContactDetailComponent)
.directive('vncContactDetailContent', ContactDetailContentComponent);

export default ContactDetailModule;
