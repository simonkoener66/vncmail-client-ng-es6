import template from './preferences.html';
import controller from './preferences.controller';

let PreferencesComponent = () => {
    return {
        restrict: 'E',
        scope: {},
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default PreferencesComponent;
