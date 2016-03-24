const CALENDARCONFIG = new WeakMap();
const CALENDARHELPER = new WeakMap();
const MOMENT = new WeakMap();
const SCOPE = new WeakMap();

class CalendarHourListInWeekController {
  /* @ngInject */
  constructor($scope, $sce, calendarConfig, calendarHelper, moment) {
    CALENDARCONFIG.set(this, calendarConfig);
    CALENDARHELPER.set(this, calendarHelper);
    MOMENT.set(this, moment);
    SCOPE.set(this, $scope);

    this.$sce = $sce;

    let originalLocale = MOMENT.get(this).locale();

    SCOPE.get(this).$on('calendar.refreshView', () => {
      if (originalLocale !== MOMENT.get(this).locale()) {
        originalLocale = MOMENT.get(this).locale();
        this.updateDays();
      }
    });

    SCOPE.get(this).$watchGroup([
      'vm.dayViewStart',
      'vm.dayViewEnd',
      'vm.dayViewSplit',
      'vm.currentDay',
      'vm.dayInWeek'
    ], () => {
      this.updateDays();
    });
  }

  updateDays() {
    let dayViewStart = MOMENT.get(this)(this.dayViewStart || '00:00', 'HH:mm');
    let dayViewEnd = MOMENT.get(this)(this.dayViewEnd || '24:00', 'HH:mm');
    let dayInWeek = [];
    let allEvents = [];
    let allDayEvents = [];
    let inDayEvents = [];

    this.dayViewSplit = parseInt(this.dayViewSplit);

    let detailHourInDay = dayViewEnd.diff(dayViewStart, 'minutes') / this.dayViewSplit;

    this.hoursList = [];
    this.dayInWeekAllDayEvent = [];

    // Check if the dayInWeek is defined.
    if (angular.isDefined(this.dayInWeek)) {
      dayInWeek = angular.copy(this.dayInWeek.days);
      allEvents = angular.copy(this.dayInWeek.events);

      this.dayInWeekAllDayEvent = angular.copy(this.dayInWeek.days);

      if (allEvents.length > 0) {
        // Reach event list and separate into allDay and inDay Events list.
        angular.forEach(allEvents, (event, index)=> {
          if (event.allDay === '1') {
            allDayEvents.push(event);
          }
          else {
            inDayEvents.push(event);
          }
        });

        // Check if allDayEvents has items.
        if (allDayEvents.length > 0) {
          let weekOfYear = dayInWeek[0].date.format('W');

          angular.forEach(this.dayInWeekAllDayEvent, (day, index)=> {
            day.events = [];
          });

          angular.forEach(allDayEvents, (event, index)=> {
            if (weekOfYear === MOMENT.get(this)(event.startsAt).format('W')) {
              let eventDayOfWeek = MOMENT.get(this)(event.startsAt).format('e');
              this.dayInWeekAllDayEvent[eventDayOfWeek].events.push(event);
            }
          });
        }

        // Check if inDayEvents has items and has any event overnight
        if (inDayEvents.length > 0) {
          let tempSeparateEventList = [];

          angular.forEach(inDayEvents, (event, index)=> {
            let eventStartsAt = MOMENT.get(this)(event.startsAt).clone();
            let eventEndsAt = MOMENT.get(this)(event.endsAt).clone();
            let eventDiffDay = eventEndsAt.diff(eventStartsAt, 'day');

            if (eventEndsAt.diff(eventStartsAt, 'minutes') > 60) {
              event.isShowEndTime = true;
            }
            else {
              event.isShowEndTime = false;
            }

            //Check if the event is held in many days.
            if (eventDiffDay > 0) {
              // Update the current event, time expanded, new endsTime
              event.isSplitted = true;
              event.newStartsAt = eventStartsAt.clone().toDate();
              event.newEndsAt = eventStartsAt.clone().hours(dayViewEnd.hours() + 1).toDate();

              // update height for event
              event.height = MOMENT.get(this)(event.newEndsAt)
                  .diff(eventStartsAt, 'minutes') / this.dayViewSplit * 30;

              // Add more new event for the next day
              for (let i = 1; i <= eventDiffDay; i++) {
                let copiedEvent = angular.copy(event);

                // Update start time and end time for copied event.
                copiedEvent.newStartsAt = MOMENT.get(this)(copiedEvent.newStartsAt)
                  .add(i, 'day')
                  .hours(dayViewStart.hours())
                  .minutes(dayViewStart.minutes())
                  .seconds(dayViewStart.seconds())
                  .toDate();

                if (eventStartsAt.clone().add(i, 'day').date() === eventEndsAt.date()) {
                  copiedEvent.newEndsAt = eventEndsAt.clone().toDate();
                }
                else {
                  copiedEvent.newEndsAt = MOMENT.get(this)(copiedEvent.newEndsAt)
                    .add(i, 'day').toDate();
                }

                copiedEvent.height = MOMENT.get(this)(copiedEvent.newEndsAt)
                    .diff(MOMENT.get(this)(copiedEvent.newStartsAt), 'minutes') / this.dayViewSplit * 30;

                tempSeparateEventList.push(copiedEvent);
              }
            }
          });

          // Insert new events list to the main events list
          if (tempSeparateEventList.length > 0) {
            inDayEvents = inDayEvents.concat(tempSeparateEventList);
          }
        }
      }
    }

    let dayCounter = MOMENT.get(this)(this.currentDay)
      .clone()
      .hours(dayViewStart.hours())
      .minutes(dayViewStart.minutes())
      .seconds(dayViewStart.seconds());

    // reach hours list and prepare detail hour for a day
    for (let i = 0; i <= detailHourInDay; i++) {
      let dayInWeekList = [];

      // check if the dayInWeek has value and reach each item to prepare time slot.
      if (dayInWeek.length > 0) {
        for (let j = 0; j < dayInWeek.length; j++) {
          // Check if the calendar config for showing full week or only work day in week
          if (!this.isShowWorkWeek || (this.isShowWorkWeek && !dayInWeek[j].isWeekend)) {
            let timeOnWeekDay = MOMENT.get(this)(dayInWeek[j].date)
              .clone()
              .hours(dayCounter.hours())
              .minutes(dayCounter.minutes())
              .seconds(dayCounter.seconds());

            dayInWeekList.push({
              label: CALENDARHELPER.get(this).formatDate(timeOnWeekDay, CALENDARCONFIG.get(this).dateFormats.date),
              date: timeOnWeekDay.clone(),
              events: []
            });
          }
        }
      }

      this.hoursList.push({
        isInWorkingTime: (dayCounter.hour() < 18 && dayCounter.hour() > 6) || false,
        label: i % 2 === 0 ? CALENDARHELPER.get(this).formatDate(dayCounter, CALENDARCONFIG.get(this).dateFormats.hour) : '',
        dayInWeekList: dayInWeekList
      });

      dayCounter.add(this.dayViewSplit, 'minutes');
    }

    if (inDayEvents.length > 0) {
      angular.forEach(inDayEvents, (event, index)=> {
        let eventStartHour,
          eventStartMin,
          indexOfEventStartDayOfWeek;

        event.ratioOfLength = 15;

        // check if the current event has been splitted
        if (event.isSplitted) {
          eventStartHour = MOMENT.get(this)(event.newStartsAt).hours();
          eventStartMin = MOMENT.get(this)(event.newStartsAt).minutes();
          indexOfEventStartDayOfWeek = MOMENT.get(this)(event.newStartsAt).format('e');
        }
        else {
          eventStartHour = MOMENT.get(this)(event.startsAt).hours();
          eventStartMin = MOMENT.get(this)(event.startsAt).minutes();
          indexOfEventStartDayOfWeek = MOMENT.get(this)(event.startsAt).format('e');
        }

        if (eventStartMin === 15 || eventStartMin === 45) {
          eventStartMin = eventStartMin - 15;
          event.top = '15px';
        }
        else {
          event.top = '0';
        }

        let indexOfEventStartHour = (eventStartHour * 60 + eventStartMin) / this.dayViewSplit;

        // Check and add the event to calendar list.
        if (angular.isDefined(this.hoursList[indexOfEventStartHour]) &&
          this.hoursList[indexOfEventStartHour].dayInWeekList.length > 0) {

          let copiedEvent = angular.copy(event);

          if (angular.isDefined(this.hoursList[indexOfEventStartHour]
              .dayInWeekList[indexOfEventStartDayOfWeek]) &&
            angular.isDefined(this.hoursList[indexOfEventStartHour]
              .dayInWeekList[indexOfEventStartDayOfWeek].events)) {
            this.hoursList[indexOfEventStartHour]
              .dayInWeekList[indexOfEventStartDayOfWeek]
              .events.push(copiedEvent);
          }
        }
      });
    }
  }

  calendarTimeCellOnClick(event, date, isAllDay) {
    if (event.which === 1) {
      let calendarTimeSlot = {
        calendarTimeSlot: {
          date: date.toDate(),
          isAllDay: isAllDay,
          folderId: undefined
        }
      };

      this.onTimeSlotClick(calendarTimeSlot);
    }
  }
}

export default CalendarHourListInWeekController;
