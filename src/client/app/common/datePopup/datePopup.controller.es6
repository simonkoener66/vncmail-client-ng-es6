class DatePopupController {
  /* @ngInject */
  constructor($compile, $state, logger, vncConstant, $rootScope, $interval, mailService) {
    var vm = this;
    vm.vncConstant = vncConstant;
    this.compile = $compile;
    this.mailService = mailService;
    this.logger = logger;
    this.$interval = $interval;
    this.$state = $state;
    this.$rootScope = $rootScope;
    this.appointments = [];
    vm.getAppointmentsByDate(vm.date);

  }

  getAppointmentsByDate(date) {
    var today = new Date();
    var requestDate = new Date(date);
    var calExpandInstStart = new Date((requestDate.getMonth() + 1) + '-' + requestDate.getDate() + '-' + today.getFullYear());
    var calExpandInstEnd = new Date((requestDate.getMonth() + 1) + '-' + requestDate.getDate() + '-' + today.getFullYear() + ' 23:59');
    let request = {
                  calExpandInstEnd: calExpandInstEnd.getTime(),
                  calExpandInstStart: calExpandInstStart.getTime(),
                  limit: 500,
                  locale: 'en_US',
                  offset: 0,
                  query: 'inid:10 OR inid:9458 OR inid:9461 OR inid:9460 OR inid:10920' +
                          'OR inid:10921 OR inid:9311 OR inid:9315' +
                          'OR inid:11614 OR inid:11616 OR inid:10' +
                          'OR inid:9306 OR inid:11615 OR inid:9309' +
                          'OR inid:9310 OR inid:9312',
                  sortBy: 'none',
                  types: 'appointment'
              };

    this.mailService.searchRequest(request, (res) => {
        if ( angular.isDefined(res.appt) ) {
          if ( angular.isArray(res.appt)) {
            this.appointments = res.appt;
          }
          else {
            this.appointments = [res.appt];
          }
        }

    });
  }

}

export default DatePopupController;
