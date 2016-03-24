import template from './preferences.import.html';
import controller from './preferences.import.controller';

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
