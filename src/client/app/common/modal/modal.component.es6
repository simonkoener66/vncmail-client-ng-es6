import template from './modal.html';
import controller from './modal.controller';

//Usage:
//<vnc-modal template="{{template}}" use_ctrl="{{use_ctrl}}"> My Modal </vnc-modal>
//<vnc-modal template="{{template}}" use_ctrl="{{use_ctrl}}" size="sm"> My Modal </vnc-modal>
//<vnc-modal template="{{template}}" use_ctrl="{{use_ctrl}}"
//    size="sm" backdrop="true" resolve="{name: 'modal'}"> My Modal </vnc-modal>
/*
 require useCtrl = Controller name by value;
 require template = template  by value;
 optional size = sm md lg by value;
 optional resolve;
 optional backdrop;
 */

let modalComponent = () => {
    return {
        transclude: true,
        restrict: 'EA',
        scope: {
            useCtrl: "@",
            size: "@",
            backdrop: "@",
            template: "@",
            resolve: "@"
        },
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default modalComponent;
