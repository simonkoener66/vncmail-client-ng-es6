//change as task need
import template from './preferences.calender.html';
import controller from './preferences.calender.controller';

let preferencesCalenderComponent = () => {
    return {
        restrict: 'E',
        scope: {},
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default preferencesCalenderComponent;
