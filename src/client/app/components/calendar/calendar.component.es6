import template from './calendar.html';
import controller from './calendar.controller';
import './_calendar.scss';

let calendarComponent = ()=> {
    return {
        restrict: 'E',
        scope: {},
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default calendarComponent;
