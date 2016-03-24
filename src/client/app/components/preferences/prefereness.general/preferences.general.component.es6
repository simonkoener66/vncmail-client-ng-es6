import template from './preferences.general.html';
import controller from './preferences.general.controller';

let GeneralComponent = () => {
    return {
        restrict: 'E',
        scope: {},
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default GeneralComponent;
