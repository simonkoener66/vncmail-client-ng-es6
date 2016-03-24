import template from './contacts.distribution.list.detail.html';
import controller from './contacts.distribution.list.detail.controller';
import './_contacts.distribution.list.detail.scss';

let contactsDistributionListDetailComponent = function () {
    return {
        restrict: 'E',
        scope: {},
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default contactsDistributionListDetailComponent;
