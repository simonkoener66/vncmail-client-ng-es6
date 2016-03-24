class MdCalendarDroppableController {
  /* @ngInject */
  constructor($element, $scope, $parse, $attrs, interact) {
    if (!interact) {
      return;
    }

    interact($element[0]).dropzone({
      ondragenter: function(event) {
        angular.element(event.target).addClass('drop-active');
      },
      ondragleave: function(event) {
        angular.element(event.target).removeClass('drop-active');
      },
      ondropdeactivate: function(event) {
        angular.element(event.target).removeClass('drop-active');
      },
      ondrop: function(event) {
        if (event.relatedTarget.dropData) {
          $parse($attrs.onDrop)($scope, {dropData: event.relatedTarget.dropData});
          $scope.$apply();
        }
      }
    });

    $scope.$on('$destroy', function() {
      interact($element[0]).unset();
    });
  }
}

export default MdCalendarDroppableController;
