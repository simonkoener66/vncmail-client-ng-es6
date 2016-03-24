let mdCalendarTitleService = (moment, calendarConfig, calendarHelper)=> {
  let calendarTitle = {
    day: day,
    workWeek: workWeek,
    week: week,
    month: month,
    year: year
  };

  return calendarTitle;

  function day(currentDay) {
    return calendarHelper.formatDate(currentDay, calendarConfig.titleFormats.day);
  }

  function workWeek(currentDay) {
    var weekTitleLabel = calendarConfig.titleFormats.week;
    return weekTitleLabel.replace('{week}', moment(currentDay).week()).replace('{year}', moment(currentDay).format('YYYY'));
  }

  function week(currentDay) {
    var weekTitleLabel = calendarConfig.titleFormats.week;
    return weekTitleLabel.replace('{week}', moment(currentDay).week()).replace('{year}', moment(currentDay).format('YYYY'));
  }

  function month(currentDay) {
    return calendarHelper.formatDate(currentDay, calendarConfig.titleFormats.month);
  }

  function year(currentDay) {
    return calendarHelper.formatDate(currentDay, calendarConfig.titleFormats.year);
  }
};

mdCalendarTitleService.$inject = ['moment', 'calendarConfig', 'calendarHelper'];

export default mdCalendarTitleService;
