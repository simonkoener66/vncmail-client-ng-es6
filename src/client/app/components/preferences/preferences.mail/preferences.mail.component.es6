//change as task need
import template from './preferences.mail.html';
import controller from './preferences.mail.controller';

let preferencesMailComponent = () => {
    return {
        restrict: 'E',
        scope: {},
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default preferencesMailComponent;
