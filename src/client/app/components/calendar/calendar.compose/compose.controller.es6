const AUTH = new WeakMap();
const COOKIE = new WeakMap();
const JSTIMEZONE = new WeakMap();
const LOGGER = new WeakMap();
const MODALINSTANCE = new WeakMap();
const ROOTSCOPE = new WeakMap();
const SCE = new WeakMap();
const SCOPE = new WeakMap();
const STATE = new WeakMap();

class CalendarComposeController {
  /* @ngInject */
  constructor($cookies, $filter, $modalInstance, $rootScope, $sce, $scope, $state,
              auth, calendarService, jstimezonedetect, logger, mailService, moment, resolveModal) {
    COOKIE.set(this, $cookies);
    MODALINSTANCE.set(this, $modalInstance);
    ROOTSCOPE.set(this, $rootScope);
    SCE.set(this, $sce);
    SCOPE.set(this, $scope);
    STATE.set(this, $state);
    AUTH.set(this, auth);
    JSTIMEZONE.set(this, jstimezonedetect);
    LOGGER.set(this, logger);

    this.$filter = $filter;
    this.calendarService = calendarService;
    this.service = mailService;
    this.moment = moment;
    this.resolveModal = resolveModal;

    this.title = this.resolveModal.title;
    this.isEdit = this.resolveModal.isEdit ? this.resolveModal.isEdit : false;

    this.appointment = {};
    this.repeatOptions = [];
    this.reminderOptions = [];
    this.calendarTreeViewOptions = [];
    this.displayOptions = [];

    // Time Picker
    this.hourStep = 1;
    this.minuteStep = 30;

    // Date Picker
    this.startDatePickerStatus = {opened: false};
    this.endDatePickerStatus = {opened: false};

    this.activate();
  }

  activate() {
    // Reset Appointment Data
    this.appointment = this.calendarService.resetAppointmentData(this.resolveModal.currentDate,
      this.resolveModal.isGetTimeFromDate,
      this.resolveModal.isAllDay,
      AUTH.get(this).user.name,
      this.repeatOptions,
      this.reminderOptions);

    // Populate data of Repeate options and set default value
    this.repeatOptions = this.calendarService.populateRepeatOptions();
    this.appointment.repeat = this.repeatOptions[0].value;

    // Populate data of Reminder options and set default value
    this.reminderOptions = this.calendarService.populateReminderOptions();
    this.appointment.reminder = this.reminderOptions[2].value;

    // Populate data of Display options and set default value
    this.displayOptions = this.calendarService.populateDisplayOptions();
    this.appointment.display = this.displayOptions[2].value;

    // Populate data of Calendar Items
    this._populateCalendarTreeViewOptions();

    // Reload appointment data from quick mode to full mode
    if (angular.isDefined(this.resolveModal.existingAppointmentObject)) {
      this.appointment = this.resolveModal.existingAppointmentObject;
    }

    // Load appointment to edit
    if (this.isEdit && angular.isDefined(this.resolveModal.inviteId)) {
      this._getAppointmentDetail(this.resolveModal.inviteId);
    }

    // watch for appointment's start date change
    SCOPE.get(this).$watch('vm.appointment.startDate', (newValue, oldValue) => {
      // reset hour, minute and second to zero
      let newStartDate = new Date(newValue.getFullYear(), newValue.getMonth(), newValue.getDate(), 0, 0, 0);
      let newEndDate = new Date(this.appointment.endDate.getFullYear(),
        this.appointment.endDate.getMonth(),
        this.appointment.endDate.getDate(), 0, 0, 0);
      // if start date > end date
      if (newStartDate.getTime() - newEndDate.getTime() > 0) {
        // set end date = start date
        this.appointment.endDate = newStartDate;
      }
    });

    // watch for appointment's end date change
    SCOPE.get(this).$watch('vm.appointment.endDate', (newValue, oldValue) => {
      this.endTimeChanged();
    });
  }

  _getAppointmentDetail(inviteId) {
    this.service.getAppointmentDetail(inviteId, (response) => {
      if (response[0] === null || !angular.isDefined(response[0])) {
        return;
      }

      /* Appointment detail object
       response = [{
       'id'
       'attendee' // attendee list
       'name' // subject / title
       'location'
       'body'
       'description'
       'calItemId' // calendar item id
       'apptId'
       'status' // TENT|CONF|CANC|NEED|COMP|INPR|WAITING|DEFERRED
       // TENTative, CONFirmed, CANCelled, COMPleted, INPRogress, WAITING, DEFERRED
       'ciFolder'
       'class' // PUB|PRI|CON. i.e. PUBlic (default), PRIvate, CONfidential
       's' // start date time
       'htmlDesc'
       'organizer'
       'e' // end date time
       'at' // attendee list - duplicate with 'attendee', but without $
       'attachment' // attachments
       'apiUrl' // vncConstant.API_URL
       'alarm' // alarm / reminder
       'recur' // recur / repeat
       'fba' // free-busy actual
       'allDay' // is all day
       }]; */

      this.appointment = response[0];
      if (this.appointment) {
        this.appointment.subject = this.appointment.name;
        this.appointment.fromEmail = AUTH.get(this).user.name;

        this.calendarService.populateApptData(this.appointment, this.reminderOptions, this.repeatOptions,
          this.displayOptions, this.calendarTreeViewOptions, this.resolveModal.isAllDay, AUTH.get(this).user.name);
      }
    }).catch((error) => {
      LOGGER.get(this).error(error, error);
    });
  }

  _populateCalendarTreeViewOptions() {
    let calendarTreeView = localStorage.getItem('CALENDAR_TREE_VIEW');

    if (calendarTreeView) {
      this.calendarTreeViewOptions = this.calendarService.parseTreeViewToArray(JSON.parse(calendarTreeView));

      if (angular.isDefined(this.resolveModal.folderId)) {
        this.appointment.calendarTreeViewSelectedId = this.resolveModal.folderId;
        this.appointment.calendarTreeViewSelectedStyles = this.$filter('filter')(this.calendarTreeViewOptions,
          {id: this.resolveModal.folderId})[0].icon.color;
      }
      else {
        this.appointment.calendarTreeViewSelectedId = this.calendarTreeViewOptions[0].id;
        this.appointment.calendarTreeViewSelectedStyles = this.calendarTreeViewOptions[0].icon.color;
      }
    }
  }

  _createAppointment(successMessage) {
    let options = this.calendarService.prepareRequestForSavingAppointment(this.appointment, this.isEdit, this.resolveModal.inviteId);
    let validationMessage = this._validate(options);
    if (validationMessage === '') {
      this.service.createAppointment(options, (response) => {
        // LOGGER.get(this).success(successMessage);
        ROOTSCOPE.get(this).$broadcast('APPOINTMENTS_CHANGED');
        this.cancel();
      }).catch((error) => {
        LOGGER.get(this).error(error, error);
      });
    } else {
      LOGGER.get(this).error(validationMessage, validationMessage, '');
    }
  }

  _updateAppointment(successMessage) {
    let options = this.calendarService.prepareRequestForSavingAppointment(this.appointment, this.isEdit, this.resolveModal.inviteId);
    let validationMessage = this._validate(options);
    if (validationMessage === '') {
      this.service.modifyAppointment(options, (response) => {
        // LOGGER.get(this).success(successMessage);
        ROOTSCOPE.get(this).$broadcast('APPOINTMENTS_CHANGED');
        this.cancel();
      }).catch((error) => {
        LOGGER.get(this).error(error, error);
      });
    } else {
      LOGGER.get(this).error(validationMessage, validationMessage, '');
    }
  }

  // Check if the appointment is valid to save
  _validate(requestOptions) {
    // Check if subject is input
    if (!(this.appointment.subject && this.appointment.subject.trim().length > 0)) {
      return 'Subject required.';
    }

    // Check if start and end date time have valid values
    if (this.appointment.startTimeStamp - this.appointment.endTimeStamp > 0) {
      return 'End Date Time must be greater than Start Date Time.';
    }

    // Check if attendee emails are valid
    if (requestOptions.inviteInfo.at && requestOptions.inviteInfo.at.length > 0) {
      for (let attendee of requestOptions.inviteInfo.at) {
        if (!(/(.+)@(.+){2,}\.(.+){2,}/.test(attendee.a))) {
          return attendee.a + ' is an invalid email address.';
        }
      }
    }

    return '';
  }

  endTimeChanged() {
    if (this.appointment && !this.resolveModal.isAllDay) { // Only trigger this event if the appt is all day
      // Compare start and end date time
      let startDateTime = new Date(this.appointment.startDate.getFullYear(),
        this.appointment.startDate.getMonth(),
        this.appointment.startDate.getDate(),
        this.appointment.startTime.getHours(),
        this.appointment.startTime.getMinutes(), 0);
      let endDateTime = new Date(this.appointment.endDate.getFullYear(),
        this.appointment.endDate.getMonth(),
        this.appointment.endDate.getDate(),
        this.appointment.endTime.getHours(),
        this.appointment.endTime.getMinutes(), 0);
      // if Start > End
      let gapDateTime = startDateTime.getTime() - endDateTime.getTime();
      if (gapDateTime > 0) {
        // --> make Start go back x times of 1 hour
        let newStartDateTime = startDateTime.getTime() - (3600000 * (Math.round(gapDateTime / 3600000) + 1));
        this.appointment.startDate = this.appointment.startTime = new Date(newStartDateTime);
      }
    }
  }

  openStartDatePicker($event) {
    this.startDatePickerStatus.opened = true;
  }

  openEndDatePicker($event) {
    this.endDatePickerStatus.opened = true;
  }

  cancel() {
    MODALINSTANCE.get(this).dismiss('cancel');
  }

  moreDetail() {
    MODALINSTANCE.get(this).close({
      openFullMode: true,
      existingAppointmentObject: this.appointment
    });
  }

  onSelectCalendarChanges() {
    this.appointment.calendarTreeViewSelectedStyles =
      this.$filter('filter')(this.calendarTreeViewOptions,
        {id: this.appointment.calendarTreeViewSelectedId})[0].icon.color;
  }

  sendInvitation() {
    if (this.isEdit) {
      this._updateAppointment('Appointment has been sent.');
    } else {
      this._createAppointment('Appointment has been sent.');
    }
  }

  saveAppointment() {
    if (this.isEdit) {
      this._updateAppointment('Appointment Saved.');
    } else {
      this._createAppointment('Appointment Saved.');
    }
  }
}

export default CalendarComposeController;
