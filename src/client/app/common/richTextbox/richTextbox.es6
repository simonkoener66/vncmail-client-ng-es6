import angular from 'angular';
import 'angular-ui-tinymce/src/tinymce.js';
import richTextboxComponent from './richTextbox.component';

let RichTextboxModule = angular.module('richTextbox', [
    'ui.tinymce'
])

.directive('vncRichTextbox', richTextboxComponent);

export default RichTextboxModule;
