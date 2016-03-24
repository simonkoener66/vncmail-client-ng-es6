class calendarDataService {
  constructor() {
    this.data = {};

    this.getDayKey = function (date) {
      return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join("-");
    };

    this.setDayContent = function (date, content) {
      this.data[this.getDayKey(date)] = content || this.data[this.getDayKey(date)] || "";
    };
  }
}

export default calendarDataService;
