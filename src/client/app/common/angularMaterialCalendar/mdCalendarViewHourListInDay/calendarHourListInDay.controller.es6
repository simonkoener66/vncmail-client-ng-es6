const COOKIE = new WeakMap();
const CALENDARCONFIG = new WeakMap();
const CALENDARHELPER = new WeakMap();
const MOMENT = new WeakMap();
const SCOPE = new WeakMap();

class CalendarHourListInWeekController {
  /* @ngInject */
  constructor($cookies, $scope, $sce, calendarConfig, calendarHelper, moment) {
    COOKIE.set(this, $cookies);
    CALENDARCONFIG.set(this, calendarConfig);
    CALENDARHELPER.set(this, calendarHelper);
    MOMENT.set(this, moment);
    SCOPE.set(this, $scope);

    this.$sce = $sce;
    let originalLocale = MOMENT.get(this).locale();

    this.activate();

    SCOPE.get(this).$on('calendar.refreshView', () => {
      if (originalLocale !== MOMENT.get(this).locale()) {
        originalLocale = MOMENT.get(this).locale();
        this.prepareCalendarDayView();
        this.updateDays();
      }
    });

    SCOPE.get(this).$watchGroup([
      'vm.dayViewStart',
      'vm.dayViewEnd',
      'vm.dayViewSplit',
      'vm.currentDay',
    ], ()=> {
      this.prepareCalendarDayView();
      this.updateDays();
    });

    SCOPE.get(this).$watchGroup([
      'vm.calendarFolderList',
      'vm.dayEvents',
    ], () => {
      this.prepareCalendarDayView();
      this.updateDays();
    });
  }

  activate() {
    // load data from cache
    let displayMode = COOKIE.get(this).get('CALENDAR_DAY_DISPLAY_MODE');

    if (angular.isDefined(displayMode)) {
      this.isShowCalendarFolder = JSON.parse(displayMode);
    }
    else {
      this.isShowCalendarFolder = true;
    }

    this.settingCalendarDayViewDisplayMode();
  }

  prepareCalendarDayView() {
    let dayViewStart = MOMENT.get(this)(this.dayViewStart || '00:00', 'HH:mm');
    let dayViewEnd = MOMENT.get(this)(this.dayViewEnd || '24:00', 'HH:mm');

    this.dayViewSplit = parseInt(this.dayViewSplit);
    this.currentDayInMoment = MOMENT.get(this)(this.currentDay);

    let detailHourInDay = dayViewEnd.diff(dayViewStart, 'minutes') / this.dayViewSplit;

    let dayCounter = this.currentDayInMoment
      .clone()
      .hours(dayViewStart.hours())
      .minutes(dayViewStart.minutes())
      .seconds(dayViewStart.seconds());

    let prepareHourList = [];

    this.hoursList = [];
    this.allDayList = [{
      date: this.currentDayInMoment.clone(),
      calendarFolders: [],
      events: []
    }];

    // reach hours list and prepare detail hour for a day
    for (let i = 0; i <= detailHourInDay; i++) {
      prepareHourList.push({
        isInWorkingTime: (dayCounter.hour() < 18 && dayCounter.hour() > 6) || false,
        label: i % 2 === 0 ? CALENDARHELPER.get(this).formatDate(dayCounter, CALENDARCONFIG.get(this).dateFormats.hour) : '',
        date: dayCounter.clone(),
        calendarFolders: [],
        events: []
      });

      dayCounter.add(this.dayViewSplit, 'minutes');
    }

    this.hoursList = angular.copy(prepareHourList);
  }

  updateDays() {
    let allEvents = [];
    let inDayEvents = [];
    let folderIds = [];
    let folderList = [];
    this.folderList = [];

    // check if the calendarFolderList is defined and get list of folderID.
    if (angular.isDefined(this.calendarFolderList) && this.calendarFolderList.length > 0) {
      folderList = angular.copy(this.calendarFolderList);

      // Calculating the width of each folder column.
      let width = (100 - folderList.length) / folderList.length + '%';

      angular.forEach(folderList, (folder, index)=> {
        // update list of folder id.
        folderIds.push(folder.id);

        folder.events = [];
        folder.width = width;
      });

      // Update calendarFolders for allDayList and hoursList.
      angular.forEach(this.hoursList, (hour, index)=> {
        hour.calendarFolders = angular.copy(folderList);
      });

      this.allDayList[0].calendarFolders = angular.copy(folderList);
      this.folderList = angular.copy(folderList);
    }

    if (angular.isDefined(this.dayEvents) && this.dayEvents.length > 0) {
      allEvents = angular.copy(this.dayEvents);

      angular.forEach(allEvents, (event, index)=> {
        if (event.allDay === '1') {
          // prepare list of all-day events.
          this.allDayList[0].events.push(event);

          if (folderIds.length > 0) {
            let folderIndex = folderIds.indexOf(event.folderId);

            // push event to folder
            this.allDayList[0].calendarFolders[folderIndex].events.push(event);
          }
        }
        else {
          // Check if the inDayEvents has any longday event, then we have to split it up into many events.
          inDayEvents = inDayEvents.concat(this.splitUpLongEvent(event));
        }
      });
    }

    if (inDayEvents.length > 0) {
      angular.forEach(inDayEvents, (event, index)=> {
        let eventStartHour,
          eventStartMin;

        event.ratioOfLength = 15;

        if (event.isSplitted) {
          eventStartHour = MOMENT.get(this)(event.newStartsAt).hours();
          eventStartMin = MOMENT.get(this)(event.newStartsAt).minutes();
        }
        else {
          eventStartHour = MOMENT.get(this)(event.startsAt).hours();
          eventStartMin = MOMENT.get(this)(event.startsAt).minutes();
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
          this.hoursList[indexOfEventStartHour].calendarFolders.length > 0) {
          let copiedEvent = angular.copy(event);

          // add event to the event list without calendar.
          this.hoursList[indexOfEventStartHour].events.push(copiedEvent);

          if (folderIds.length > 0) {
            let folderIndex = folderIds.indexOf(copiedEvent.folderId);

            // push event to folder
            this
              .hoursList[indexOfEventStartHour]
              .calendarFolders[folderIndex].events.push(copiedEvent);
          }
        }
      });
    }
  }

  splitUpLongEvent(event) {
    let dayViewStart = MOMENT.get(this)(this.dayViewStart || '00:00', 'HH:mm');
    let dayViewEnd = MOMENT.get(this)(this.dayViewEnd || '24:00', 'HH:mm');

    let eventStartsAt = MOMENT.get(this)(event.startsAt).clone();
    let eventEndsAt = MOMENT.get(this)(event.endsAt).clone();
    let eventDiffDay = eventEndsAt.diff(eventStartsAt, 'day');

    if (eventEndsAt.diff(eventStartsAt, 'minutes') > 60) {
      event.isShowEndTime = true;
    }
    else {
      event.isShowEndTime = false;
    }

    // Check if the event is held in many days.
    if (eventDiffDay > 0) {
      let tempSeparateEventList = [];

      // Update the current event, time expanded, new endsTime
      event.isSplitted = true;
      event.newStartsAt = eventStartsAt.clone().toDate();
      event.newEndsAt = eventStartsAt.clone().hours(dayViewEnd.hours() + 1).toDate();

      // Update height for event
      event.height = MOMENT.get(this)(event.newEndsAt)
          .diff(eventStartsAt, 'minutes') / this.dayViewSplit * 30;

      // Add the current event

      if (MOMENT.get(this)(event.newStartsAt).date() === this.currentDayInMoment.date()) {
        tempSeparateEventList.push(event);
      }

      // Add more new event for the next day
      for (let i = 1; i <= eventDiffDay; i++) {
        let copiedEvent = angular.copy(event);

        if (MOMENT.get(this)(copiedEvent.newStartsAt).add(i, 'day').date() === this.currentDayInMoment.date()) {
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

      return tempSeparateEventList;
    }
    else {
      return event;
    }
  }

  calendarDayViewOnClick() {
    this.isShowCalendarFolder = !this.isShowCalendarFolder;

    this.settingCalendarDayViewDisplayMode();

    COOKIE.get(this).put('CALENDAR_DAY_DISPLAY_MODE', this.isShowCalendarFolder);
  }

  settingCalendarDayViewDisplayMode() {
    if (this.isShowCalendarFolder) {
      this.displayModeModel = 'Merge';
      this.displayIconMode = 'mdi:call-merge';
    }
    else {
      this.displayModeModel = 'Split';
      this.displayIconMode = 'mdi:call-split';
    }
  }

  calendarTimeCellOnClick(event, date, isAllDay, folderId) {
    if (event.which === 1) {
      let calendarTimeSlot = {
        calendarTimeSlot: {
          date: date.toDate(),
          isAllDay: isAllDay,
          folderId: folderId
        }
      };

      this.onTimeSlotClick(calendarTimeSlot);
    }
  }
}

export default CalendarHourListInWeekController;
