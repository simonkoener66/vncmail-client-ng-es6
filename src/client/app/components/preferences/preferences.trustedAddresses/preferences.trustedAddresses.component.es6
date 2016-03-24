//change as task need
import template from './preferences.trustedAddresses.html';
import controller from './preferences.trustedAddresses.controller';

let preferencesTrustedAddressesComponent = () => {
    return {
        restrict: 'E',
        scope: {},
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default preferencesTrustedAddressesComponent;
