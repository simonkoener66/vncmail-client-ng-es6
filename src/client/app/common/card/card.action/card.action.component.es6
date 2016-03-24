/* @ngInject */
let cardActionComponent = () => {
    return {
        restrict: 'E',
        transclude: true,
        scope: {},
        template: '<div class="actions text-right" ng-transclude></div>'
    };
};

export default cardActionComponent;
