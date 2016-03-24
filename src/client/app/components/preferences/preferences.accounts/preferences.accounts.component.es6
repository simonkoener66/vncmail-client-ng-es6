//change as task need
import template from './preferences.accounts.html';
import controller from './preferences.accounts.controller';

let preferencesAccountsComponent = () => {
    return {
        restrict: 'E',
        scope: {},
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default preferencesAccountsComponent;
