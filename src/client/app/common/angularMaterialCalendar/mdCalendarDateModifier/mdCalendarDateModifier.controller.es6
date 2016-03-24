const ATTRIBUTES = new WeakMap();
const MOMENT = new WeakMap();
const SCOPE = new WeakMap();

class MdCalendarDateModifierController {
  /* @ngInject */
  constructor($element, $attrs, $scope, moment) {
    ATTRIBUTES.set(this, $attrs);
    MOMENT.set(this, moment);
    SCOPE.set(this, $scope);

    let onClick = ()=> {
      if (angular.isDefined(ATTRIBUTES.get(this).setToToday)) {
        this.date = new Date();
      } else if (angular.isDefined(ATTRIBUTES.get(this).increment)) {
        this.date = MOMENT.get(this)(this.date).add(1, this.momentFormatConverted(this.increment)).toDate();
      } else if (angular.isDefined(ATTRIBUTES.get(this).decrement)) {
        this.date = MOMENT.get(this)(this.date).subtract(1, this.momentFormatConverted(this.decrement)).toDate();
      }
      SCOPE.get(this).$apply();
    };

    $element.bind('click', onClick);

    SCOPE.get(this).$on('$destroy', () => {
      $element.unbind('click', onClick);
    });

  }

  momentFormatConverted(viewControl) {
    let dateFormat = viewControl;
    if (dateFormat === 'workWeek') {
      dateFormat = 'week';
    }

    if (dateFormat === 'agenda') {
      dateFormat = 'month';
    }

    return dateFormat;
  }
}

export default MdCalendarDateModifierController;
