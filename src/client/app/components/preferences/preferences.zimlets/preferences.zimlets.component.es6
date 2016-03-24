//change as task need
import template from './preferences.zimlets.html';
import controller from './preferences.zimlets.controller';

let preferencesZimletsComponent = () => {
    return {
        restrict: 'E',
        scope: {},
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default preferencesZimletsComponent;
