import template from './preferences.export.html';
import controller from './preferences.export.controller';

let exportComponent = () => {
    return {
        restrict: 'E',
        scope: {},
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default exportComponent;
