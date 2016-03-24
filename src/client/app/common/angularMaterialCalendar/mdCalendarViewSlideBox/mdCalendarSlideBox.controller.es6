const COOKIE = new WeakMap();
const CALENDARCONFIG = new WeakMap();
const CALENDARHELPER = new WeakMap();
const MOMENT = new WeakMap();
const SCOPE = new WeakMap();

class MdCalendarSlideBoxController {
  /* @ngInject */
  constructor($sce, $scope, $timeout, calendarConfig) {
    var vm = this;
    vm.$sce = $sce;
    vm.calendarConfig = calendarConfig;

    vm.isCollapsed = true;
    $scope.$watch('vm.isOpen', function(isOpen) {
      //events must be populated first to set the element height before animation will work
      $timeout(function() {
        vm.isCollapsed = !isOpen;
      });
    });
  }
}

export default MdCalendarSlideBoxController;
