import template from './sidebar.html';
import controller from './sidebar.controller';

//Usage:
//<vnc-sidebar></vnc-sidebar>

let sidebarComponent = () => {
    return {
        restrict: 'EA',
        scope: {},
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default sidebarComponent;
