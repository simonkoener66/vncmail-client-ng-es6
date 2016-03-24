const CALENDARCONFIG = new WeakMap();
const CALENDARHELPER = new WeakMap();
const MOMENT = new WeakMap();
const SCOPE = new WeakMap();

class MdCalendarMonthViewController {
  /* @ngInject */
  constructor($scope, moment, calendarHelper, calendarConfig) {
    var vm = this;
    vm.calendarConfig = calendarConfig;
    vm.openRowIndex = null;

    $scope.$on('calendar.refreshView', function () {

      vm.weekDays = calendarHelper.getWeekDayNames();

      vm.view = calendarHelper.getMonthView(vm.events, vm.currentDay, vm.cellModifier);
      var rows = Math.floor(vm.view.length / 7);
      vm.monthOffsets = [];

      for (var i = 0; i < rows; i++) {
        vm.monthOffsets.push({
          weekIndex: i * 7,
          weekOfYear: vm.view[i * 7].date.week()
        });
      }

      //Auto open the calendar to the current day if set
      if (vm.cellIsOpen && vm.openRowIndex === null) {
        vm.openDayIndex = null;
        vm.view.forEach(function (day) {
          if (day.inMonth && moment(vm.currentDay).startOf('day').isSame(day.date)) {
            vm.dayClicked(day, true);
          }
        });
      }
    });

    vm.dayClicked = function (day, dayClickedFirstRun, $event) {

      if (!dayClickedFirstRun) {
        vm.onTimespanClick({
          calendarDate: day.date.toDate(),
          $event: $event
        });
        if ($event && $event.defaultPrevented) {
          return;
        }
      }

      vm.openRowIndex = null;
      var dayIndex = vm.view.indexOf(day);
      if (dayIndex === vm.openDayIndex) { //the day has been clicked and is already open
        vm.openDayIndex = null; //close the open day
        vm.cellIsOpen = false;
      } else {
        vm.openDayIndex = dayIndex;
        vm.openRowIndex = Math.floor(dayIndex / 7);
        vm.cellIsOpen = true;
      }

    };

    vm.highlightEvent = function (event, shouldAddClass) {

      vm.view.forEach(function (day) {
        delete day.highlightClass;
        if (shouldAddClass) {
          var dayContainsEvent = day.events.indexOf(event) > -1;
          if (dayContainsEvent) {
            day.highlightClass = 'day-highlight dh-event-' + event.type;
          }
        }
      });

    };

    vm.handleEventDrop = function (event, newDayDate) {

      var newStart = moment(event.startsAt)
        .date(moment(newDayDate).date())
        .month(moment(newDayDate).month());

      var newEnd = calendarHelper.adjustEndDateFromStartDiff(event.startsAt, newStart, event.endsAt);

      vm.onEventTimesChanged({
        calendarEvent: event,
        calendarDate: newDayDate,
        calendarNewEventStart: newStart.toDate(),
        calendarNewEventEnd: newEnd ? newEnd.toDate() : null
      });
    };
  }
}

export default MdCalendarMonthViewController;
