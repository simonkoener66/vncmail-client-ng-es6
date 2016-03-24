//change as task need
import template from './preferences.outOfOffice.html';
import controller from './preferences.outOfOffice.controller';

let preferencesOutOfOfficeComponent = () => {
    return {
        restrict: 'E',
        scope: {},
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default preferencesOutOfOfficeComponent;
