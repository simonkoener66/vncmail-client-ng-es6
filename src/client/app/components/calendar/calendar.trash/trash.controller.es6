const SCOPE = new WeakMap();
const LOGGER = new WeakMap();

class CalendarTrashController {
  /* @ngInject */
  constructor($scope, logger, calendarService, mailService) {
    var vm = this;
    SCOPE.set(vm, $scope);
    LOGGER.set(vm, logger);

    vm.calendarService = calendarService;
    vm.mailService = mailService;

    vm.activate();
  }

  activate() {
    var vm = this;

    // HACK: get appointment for Calendar folder (10)
    vm.calendarService.getAppointmentsFromTrash((error) => {
      LOGGER.get(vm).error(error);
    });

    SCOPE.get(vm).$watchCollection(() => {
      return vm.calendarService.TrashAppointmentList;
    }, (newList, oldList) => {
      if (angular.isDefined(newList)) {
        vm.appointmentList = newList;
      }
    });
  }
}

export default CalendarTrashController;
