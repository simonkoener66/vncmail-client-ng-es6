let calendarListRun = (routerHelper) => {
  let getStates = () => {
    return [
      {
        state: 'calendar.list',
        config: {
          url: '/list',
          template: '<calendar-list></calendar-list>'
        }
      }
    ];
  };

  routerHelper.configureStates(getStates());
};

calendarListRun.$inject = ['routerHelper'];

export default calendarListRun;
