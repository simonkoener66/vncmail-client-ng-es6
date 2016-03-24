let calendarRun = (routerHelper) => {
  let getStates = () => {
    return [
      {
        state: 'calendar',
        config: {
          url: '/calendar',
          template: '<calendar></calendar>',
          title: 'Calendar',
          settings: {
            nav: 1,
            content: 'Calendar',
            tooltip: 'Go to Calendar',
            icon: 'event_note'
          }
        }
      }
    ];
  };

  routerHelper.configureStates(getStates());
};

calendarRun.$inject = ['routerHelper'];

export default calendarRun;
