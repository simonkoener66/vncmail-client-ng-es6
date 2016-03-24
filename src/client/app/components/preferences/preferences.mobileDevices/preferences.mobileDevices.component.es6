//change as task need
import template from './preferences.mobileDevices.html';
import controller from './preferences.mobileDevices.controller';

let preferencesMobileDevicesComponent = () => {
    return {
        restrict: 'E',
        scope: {},
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default preferencesMobileDevicesComponent;
