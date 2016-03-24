const LOCALE = new WeakMap();
const LOG = new WeakMap();
const MOMENT = new WeakMap();
const SCOPE = new WeakMap();
const TIMEOUT = new WeakMap();

class CalendarController {
  /* @ngInject */
  constructor($scope, $log, $timeout, $attrs, $locale, moment, calendarTitle) {
    LOCALE.set(this, $locale);
    LOG.set(this, $log);
    MOMENT.set(this, moment);
    SCOPE.set(this, $scope);
    TIMEOUT.set(this, $timeout);

    let daysOfWeekList = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    let indexOfFirstDayOfWeek = daysOfWeekList.indexOf(this.firstDayOfWeek);

    // config to display first day of week
    MOMENT.get(this).locale('en', {
      week: {
        dow: indexOfFirstDayOfWeek > -1 ? indexOfFirstDayOfWeek : 0
      }
    });

    this.events = this.events || [];

    var previousDate = MOMENT.get(this)(this.currentDay);
    var previousView = this.view;

    var eventIsValid = (event)=> {
      if (!event.startsAt) {
        LOG.get(this)
          .warn('Calendar: ', 'Event is missing the startsAt field', event);
      }

      if (!angular.isDate(event.startsAt)) {
        LOG.get(this)
          .warn('Calendar: ', 'Event startsAt should be a javascript date object', event);
      }

      if (angular.isDefined(event.endsAt)) {
        if (!angular.isDate(event.endsAt)) {
          LOG.get(this)
            .warn('Calendar: ', 'Event endsAt should be a javascript date object', event);
        }
        if (MOMENT.get(this)(event.startsAt).isAfter(MOMENT.get(this)(event.endsAt))) {
          LOG.get(this)
            .warn('Calendar: ', 'Event cannot start after it finishes', event);
        }
      }

      return true;
    };

    var refreshCalendar = () => {
      if (calendarTitle[this.view] && angular.isDefined($attrs.viewTitle)) {
        this.viewTitle = calendarTitle[this.view](this.currentDay);
      }

      this.events = this.events.filter(eventIsValid).map(function (event, index) {
        Object.defineProperty(event, '$id', {enumerable: false, configurable: true, value: index});
        return event;
      });

      //if on-timespan-click="calendarDay = calendarDate" is set then don't update the view as nothing needs to change
      let currentDate = MOMENT.get(this)(this.currentDay);
      let shouldUpdate = true;
      if (
        previousDate.clone().startOf(this.view).isSame(currentDate.clone().startOf(this.view)) && !previousDate.isSame(currentDate) &&
        this.view === previousView
      ) {
        shouldUpdate = false;
      }
      previousDate = currentDate;
      previousView = this.view;

      if (shouldUpdate) {
        // a $timeout is required as $broadcast is synchronous so if a new events array is set the calendar won't update
        TIMEOUT.get(this)(() => {
          SCOPE.get(this).$broadcast('calendar.refreshView');
        });
      }
    };

    let eventsWatched = false;

    //Refresh the calendar when any of these variables change.
    SCOPE.get(this).$watchGroup([
      'vm.currentDay',
      'vm.view',
      'vm.cellIsOpen',
      'vm.calendarFolderList',
      () => {
        return MOMENT.get(this).locale() + LOCALE.get(this).id; //Auto update the calendar when the locale changes
      }
    ], () => {
      if (!eventsWatched) {
        eventsWatched = true;
        //need to deep watch events hence why it isn't included in the watch group
        SCOPE.get(this).$watch('vm.events', refreshCalendar, true); //this will call refreshCalendar when the watcher starts (i.e. now)
      } else {
        refreshCalendar();
      }
    });

    this.activate();
  }

  activate() {
    this.viewControlsModel = '';
    this.calendarViewControls = [
      {
        name: 'Day view',
        value: 'day',
        icon: 'mdi:calendar',
        isDisabled: false,
        isSelected: false,
        tooltipDirection: 'left'
      }, {
        name: 'Work week',
        value: 'workWeek',
        icon: 'mdi:view-week',
        isDisabled: false,
        isSelected: false,
        tooltipDirection: 'right'
      }, {
        name: 'Week view',
        value: 'week',
        icon: 'mdi:view-week',
        isDisabled: false,
        isSelected: false,
        tooltipDirection: 'left'
      }, {
        name: 'Month view',
        value: 'month',
        icon: 'mdi:view-module',
        isDisabled: false,
        isSelected: false,
        tooltipDirection: 'right'
      }, {
        name: 'Year view',
        value: 'year',
        icon: 'mdi:calendar-multiple',
        isDisabled: false,
        isSelected: false,
        tooltipDirection: 'left'
      }, {
        name: 'Agenda',
        value: 'agenda',
        icon: 'mdi:view-agenda',
        isDisabled: true,
        isSelected: false,
        tooltipDirection: 'right'
      }];

    this.updateSelectedViewControl();
  }

  changeView(view, newDay) {
    this.view = view;
    this.currentDay = newDay;

    this.updateSelectedViewControl();
  }

  drillDown(date) {
    let rawDate = MOMENT.get(this)(date).toDate();

    let nextView = {
      year: 'month',
      month: 'day',
      week: 'day',
      workWeek: 'day'
    };

    if (this.onDrillDownClick({calendarDate: rawDate, calendarNextView: nextView[this.view]}) !== false) {
      this.changeView(nextView[this.view], rawDate);
    }
  };

  updateSelectedViewControl() {
    angular.forEach(this.calendarViewControls, (item, index)=> {
      if (item.value === this.view) {
        item.isSelected = true;
        this.selectingViewControl = item;
      }
      else {
        item.isSelected = false;
      }
    });
  }

  calendarViewControlOnClick(viewControl) {
    if (!viewControl.isSelected) {
      // reset selected item for view controls
      this.resetStateOfSelectingViewControls();

      // set the selected state for current selecting view control.
      viewControl.isSelected = true;
      this.view = viewControl.value;
      this.selectingViewControl = viewControl;
    }
  }

  resetStateOfSelectingViewControls() {
    angular.forEach(this.calendarViewControls, (item, index)=> {
      item.isSelected = false;
    });
  }
}

export default CalendarController;
