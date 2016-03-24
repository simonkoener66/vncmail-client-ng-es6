//change as task need
import template from './preferences.signatures.html';
import controller from './preferences.signatures.controller';

let preferencesSignaturesComponent = () => {
    return {
        restrict: 'E',
        scope: {},
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default preferencesSignaturesComponent;
