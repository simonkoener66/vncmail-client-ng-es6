import template from './file.upload.html';
import controller from './file.upload.controller';

let fileuploadComponent = function () {
    //Usage:
    //<vnc-file-upload ng-model="files"></vnc-file-upload>
    //<vnc-file-upload ng-model="files" multiple="true"></vnc-file-upload>
    //ngModel="Array"  required
    //multiple="true"  optional     default true
    return {
        restrict: 'E',
        require: 'ngModel',
        scope: {
            multiple: '@',
            files: '=ngModel',
            draft: '&',
            errFile: '='
        },
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };


};

export default fileuploadComponent;
