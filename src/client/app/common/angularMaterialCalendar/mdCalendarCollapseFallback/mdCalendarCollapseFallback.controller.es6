const COOKIE = new WeakMap();
const CALENDARCONFIG = new WeakMap();
const CALENDARHELPER = new WeakMap();
const MOMENT = new WeakMap();
const SCOPE = new WeakMap();

class MdCalendarCollapseFallbackController {
  /* @ngInject */
  constructor($scope, $attrs, $element) {
    $scope.$watch($attrs.mwlCollapseFallback, function(shouldCollapse) {
      if (shouldCollapse) {
        $element.addClass('ng-hide');
      } else {
        $element.removeClass('ng-hide');
      }
    });
  }
}

export default MdCalendarCollapseFallbackController;
