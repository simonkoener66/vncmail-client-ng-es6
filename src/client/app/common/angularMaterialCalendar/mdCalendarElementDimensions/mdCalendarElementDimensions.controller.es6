class MdCalendarElementDimensionsController {
  /* @ngInject */
  constructor($element, $scope, $parse, $attrs) {
    $parse($attrs.mwlElementDimensions).assign($scope, {
      width: $element[0].offsetWidth,
      height: $element[0].offsetHeight
    });
  }
}

export default MdCalendarElementDimensionsController;
