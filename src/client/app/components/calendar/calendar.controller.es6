const LOGGER = new WeakMap();
const SCOPE = new WeakMap();
const STATE = new WeakMap();

class CalendarController {
  /* @ngInject */
  constructor($rootScope, $scope, $state, calendarService, sidebarCalendarFolderService, sidebarService, logger) {
    let vm = this;

    // sets default label for the sidebar dropdown button for Calendar state
    sidebarService.state = 'calendar';

    //data initialization
    LOGGER.set(vm, logger);
    SCOPE.set(vm, $scope);
    STATE.set(vm, $state);

    vm.title = 'Calendar';

    calendarService.apiUrl = $rootScope.API_URL;
    vm.calendarService = calendarService;
    vm.calendarFolderService = sidebarCalendarFolderService;

    vm._activate();
  }

  _activate() {
    let vm = this;

    // Gets latest appointments for init load (no need date-range).
//    vm.service.getAppointmentsFromDateRange(vm.service.requestStartDateTime, vm.service.requestEndDateTime);

    // TODO: Check for the latest save state to load this view.
    // HACK: Go to calendar view (month, week, day...) for now.
    let viewType = vm.calendarService.calendarView;

    if (viewType === 'list') {
      STATE.get(vm).go('calendar.list');
    } else {
      STATE.get(vm).go('calendar.view');
    }

    // logger.info('Activated Calendar View');

    SCOPE.get(vm).$watch(() => {
      return vm.calendarService.IsReady
    }, (newValue, oldValue) => {
      if (newValue && !oldValue) {
        // if we've got the folders, start getting the appointments.
        vm._getAppointmentData();
      }
    });

    SCOPE.get(vm).$on('APPOINTMENTS_CHANGED', (e, value) => {
//      vm.service.getAppointmentsFromDateRange(vm.service.requestStartDateTime, vm.service.requestEndDateTime);
    });

    SCOPE.get(vm).$on('APPOINTMENT_DELETED', () => {
//      vm.service.getAppointmentsFromDateRange(vm.service.requestStartDateTime, vm.service.requestEndDateTime);
    });

    SCOPE.get(vm).$on('TRASH_CHECKED_CHANGED', (event, checkState) => {
      vm.showTrashPanel = checkState;
    });
  }

  _getAppointmentData() {
    let vm = this;

    let currentDay = new Date().getDate(); // dd
    let currentMonth = new Date().getMonth(); // mm
    let currentYear = new Date().getFullYear(); // yyyy

    // UNDONE: Just get appt for current month, need to get appt depend on the selected month
    // start day of current month
    vm.fromDate = new Date(currentYear, currentMonth, 1, 0, 0, 0, 0);

    // end day of current month
    vm.toDate = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

    let folders = vm.calendarFolderService.CheckedCalendarFolderIds
    // HACK: get appointment for Calendar folder (10)
    vm.calendarService.getAppointments(
      vm.fromDate, vm.toDate,
      vm.calendarFolderService.CheckedCalendarFolderIds,
      (error) => {
        LOGGER.get(vm).error('Get Appointments error', error);
      });
  }
}

export default CalendarController;
