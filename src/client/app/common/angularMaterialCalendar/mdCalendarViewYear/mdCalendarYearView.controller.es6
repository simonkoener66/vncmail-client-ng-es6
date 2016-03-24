const COOKIE = new WeakMap();
const CALENDARCONFIG = new WeakMap();
const CALENDARHELPER = new WeakMap();
const MOMENT = new WeakMap();
const SCOPE = new WeakMap();

class MdCalendarYearViewController {
  /* @ngInject */
  constructor($scope, moment, calendarHelper) {
    var vm = this;
    vm.openMonthIndex = null;

    $scope.$on('calendar.refreshView', function() {
      vm.view = calendarHelper.getYearView(vm.events, vm.currentDay, vm.cellModifier);

      //Auto open the calendar to the current day if set
      if (vm.cellIsOpen && vm.openMonthIndex === null) {
        vm.openMonthIndex = null;
        vm.view.forEach(function(month) {
          if (moment(vm.currentDay).startOf('month').isSame(month.date)) {
            vm.monthClicked(month, true);
          }
        });
      }

    });

    vm.monthClicked = function(month, monthClickedFirstRun, $event) {

      if (!monthClickedFirstRun) {
        vm.onTimespanClick({
          calendarDate: month.date.toDate(),
          $event: $event
        });
        if ($event && $event.defaultPrevented) {
          return;
        }
      }

      vm.openRowIndex = null;
      var monthIndex = vm.view.indexOf(month);
      if (monthIndex === vm.openMonthIndex) { //the month has been clicked and is already open
        vm.openMonthIndex = null; //close the open month
        vm.cellIsOpen = false;
      } else {
        vm.openMonthIndex = monthIndex;
        vm.openRowIndex = Math.floor(monthIndex / 4);
        vm.cellIsOpen = true;
      }

    };

    vm.handleEventDrop = function(event, newMonthDate) {
      var newStart = moment(event.startsAt).month(moment(newMonthDate).month());
      var newEnd = calendarHelper.adjustEndDateFromStartDiff(event.startsAt, newStart, event.endsAt);

      vm.onEventTimesChanged({
        calendarEvent: event,
        calendarDate: newMonthDate,
        calendarNewEventStart: newStart.toDate(),
        calendarNewEventEnd: newEnd ? newEnd.toDate() : null
      });
    };
  }
}

export default MdCalendarYearViewController;
