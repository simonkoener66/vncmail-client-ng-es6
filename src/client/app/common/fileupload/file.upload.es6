import angular from 'angular';
import FileRepeat from './file.repeat/file.repeat';
import fileuploadComponent from './file.upload.component';
import './_file.upload.scss';

let fileuploadModule = angular.module('fileUpload', [
    FileRepeat.name
])

.directive('vncFileUpload', fileuploadComponent);

export default fileuploadModule;
