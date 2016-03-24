let calendarViewRun = (routerHelper) => {
  let getStates = () => {
    return [
      {
        state: 'calendar.view',
        config: {
//          url: '/:viewType',
          template: '<calendar-view></calendar-view>',
          title: 'Calendar View',
          settings: {
            nav: 2,
          }
        }
      }
    ];
  };

  routerHelper.configureStates(getStates());
};

calendarViewRun.$inject = ['routerHelper'];

export default calendarViewRun;
