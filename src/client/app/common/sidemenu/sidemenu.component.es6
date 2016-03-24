import template from './sidemenu.html';
import controller from './sidemenu.controller';

//Usage:
//<vnc-sidemenu></vnc-sidemenu>

let sidemenuComponent = () => {
    return {
        restrict: 'EA',
        scope: {},
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default sidemenuComponent;
