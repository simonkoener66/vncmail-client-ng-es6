import template from './file.repeat.html';
import controller from './file.repeat.controller';

let filerepeatComponent = function () {
    //Usage:
    //<vnc-file-repeat ngModel="files"></vnc-file-repeat>
    //ngModel="Array"       array you want to show with repetition;
    return {
        restrict: 'E',
        scope: {
            files: '=ngModel'
        },
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };


};

export default filerepeatComponent;
