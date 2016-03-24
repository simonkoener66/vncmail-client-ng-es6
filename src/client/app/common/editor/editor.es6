import 'script!trix/dist/trix.js';
import editorComponent from './editor.component';
import './_editor.scss';

let EditorModule = angular.module('editor', [])

.directive('vncEditor', editorComponent);

export default EditorModule;
