import angular from 'angular';
import Header from './header/header';
import SideMenu from './sidemenu/sidemenu';
import Sidebar from './sidebar/sidebar';
import Tag from './tag/tag';
import Modal from './modal/modal';
import Avatar from './avatar/avatar';
import FileUpload from './fileupload/file.upload';
import AutoComplete from './autocomplete/autocomplete';
import AutoResize from './autoresize/autoresize';
import ResizeHeader from './resizeHeader/resizeHeader';
import VNCButton from './button/button';
import VNCContactDetail from './contact.detail/contact.detail';
import Menu from './menu/menu';
import VNCCardModule from './card/card';
import HamburgerModule from './hamburger/hamburger';
import _ from 'lodash';
import coreModule from './core/core';
import appServiceModule from './services/service.component';
import uiTree from './uiTree/angular-ui-tree.js';
import uiTreeFilter from './uiTree/angular-ui-tree-filter.js';
import ContextMenu from './contextMenu/contextMenu';
import VNCEditor from './editor/editor';
import ContactPopup from './contactPopup/contactPopup';
import DatePopup from './datePopup/datePopup';
import angularMoment from 'angular-moment';
import VncCalendar from './angularMaterialCalendar/mdCalendar';
import './bootstrapDatepicker/bootstrap-datepicker';
import './uiTree/angular-ui-tree.min.scss';
import './angularPerfectScrollbar/perfect-scrollbar.min.scss';
import './angularPerfectScrollbar/perfect-scrollbar.min.js';
import './angularPerfectScrollbar/perfect-scrollbar.with-mousewheel.min.js';
import angularPerfectScrollbar from './angularPerfectScrollbar/angular-perfect-scrollbar.js';
import './ngTagsInput/_ng-tags-input.scss';
import './bootstrapDatepicker/_bootstrap-datepicker.min.scss';
import './_common.scss';

let commonModule = angular.module('app.common', [
    Header.name,
    SideMenu.name,
    Sidebar.name,
    Tag.name,
    coreModule.name,
    Modal.name,
    Avatar.name,
    FileUpload.name,
    AutoComplete.name,
    AutoResize.name,
    VNCButton.name,
    appServiceModule.name,
    Menu.name,
    VNCCardModule.name,
    ResizeHeader.name,
    VNCContactDetail.name,
    'perfect_scrollbar',
    'ui.tree',
    'ui.tree-filter',
    ContextMenu.name,
    ContactPopup.name,
    //VncMdCalendar.name,
    DatePopup.name,
    HamburgerModule.name,
    VncCalendar.name,
    VNCEditor.name
]);

export default commonModule;
