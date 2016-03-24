import template from './preferences.notification.html';
import controller from './preferences.notification.controller';

let ImportComponent = () => {
    return {
        restrict: 'E',
        scope: {},
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default ImportComponent;
