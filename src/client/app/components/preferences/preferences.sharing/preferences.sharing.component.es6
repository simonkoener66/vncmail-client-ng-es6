//change as task need
import template from './preferences.sharing.html';
import controller from './preferences.sharing.controller';

let preferencesSharingComponent = () => {
    return {
        restrict: 'E',
        scope: {},
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default preferencesSharingComponent;
