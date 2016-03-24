/* jshint -W104, -W119, -W069, -W116 */
import template from './home.html';
import controller from './home.controller';

let homeComponent = () => {
    return {
        restrict: 'E',
        scope: {},
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default homeComponent;
