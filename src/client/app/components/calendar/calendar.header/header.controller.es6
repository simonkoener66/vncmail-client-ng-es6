const STATE = new WeakMap();

class CalendarHeaderController {
  /* @ngInject */
  constructor($state, calendarService) {
    let vm = this;

    STATE.set(vm, $state);
    vm.service = calendarService;

    vm.activate();
  }

  activate() {
    let vm = this;

    vm.calendarView = vm.service.calendarView || 'calendar';
    vm.calendarDay = vm.service.calendarDay;
  }

  changeCalendarView(viewName) {
    let vm = this;

    if (viewName === 'list') {
      vm.calendarView = 'list';
      STATE.get(this).go('calendar.list');
    } else {
      vm.calendarView = 'calendar';
      STATE.get(this).go('calendar.view');
    }
  }
}

export default CalendarHeaderController;
