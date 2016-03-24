const SCOPE = new WeakMap();
const STATE = new WeakMap();
const LOGGER = new WeakMap();

class CalendarListController {
  /* @ngInject */
  constructor($scope, $state, logger, calendarService) {
    var vm = this;
    SCOPE.set(vm, $scope);
    STATE.set(vm, $state);
    LOGGER.set(vm, logger);

    vm.calendarService = calendarService;
    vm.isCalendarView = false;
    vm.calendarControl = 'list';

    vm.activate();
  }

  activate() {
    var vm = this;

//    let currentDay = new Date().getDate(); // dd
//    let currentMonth = new Date().getMonth(); // mm
//    let currentYear = new Date().getFullYear(); // yyyy
//
//    // today
//    vm.fromDate = new Date(currentYear, currentMonth, currentDay, 0, 0, 0, 0);
//    // 2 weeks later
//    vm.toDate = new Date(currentYear, currentMonth, currentDay + 14, 23, 59, 59, 999);
//
//    // HACK: get appointment for Calendar folder (10)
//    vm.calendarService.getAppointments(
//      vm.fromDate, vm.toDate,
//      ['10'],
//      (error) => {
//        LOGGER.get(vm).error('Get Appointments error', error);
//      });

    SCOPE.get(vm).$watchCollection(() => {
      return vm.calendarService.AppointmentList;
    }, (newApptList, oldApptList) => {
      if (angular.isDefined(newApptList)) {
        vm.appointmentList = newApptList;
      }
    });
  }

  calendarControlOnClicking() {
    var vm = this;
    STATE.get(vm).go('calendar.view', {
      viewType: vm.calendarControl
    });
  }

  dateRangeFilterChanged() {
    var vm = this;
//    vm.calendarService.getAppointmentsFromDateRange(vm.fromDate.getTime(), vm.toDate.getTime());
  }
}

export default CalendarListController;
