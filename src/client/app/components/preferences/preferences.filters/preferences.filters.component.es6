//change as task need
import template from './preferences.filters.html';
import controller from './preferences.filters.controller';

let preferencesFiltersComponent = () => {
    return {
        restrict: 'E',
        scope: {},
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default preferencesFiltersComponent;
