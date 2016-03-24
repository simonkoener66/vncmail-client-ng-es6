import composeNewAppointmentTemplate from './calendar.compose/compose.html';

const APPT_LIMIT = 500;
const TRASH_LIMIT = 20;
const OFFSET = 0;

const HTTP = new WeakMap();
const Q = new WeakMap();
const SCE = new WeakMap();
const TIMEOUT = new WeakMap();

class CalendarSerivce {
  /* @ngInject */
  constructor($http, $q, $sce, $timeout, auth, jstimezonedetect, sidebarService, vncConstant) { // mailService,
    let service = this;
    HTTP.set(service, $http);
    Q.set(service, $q);
    SCE.set(service, $sce);
    TIMEOUT.set(service, $timeout);

    //service.mailService = mailService;
    service.vncConstant = vncConstant;

    service.isReady = false;
    service.appointmentMap = new Map();
    service.outdatedAppointmentMap = new Map();
    service.appointmentList = [];
    service.trashAppointmentList = [];
    //service.authUser = auth.user.name;
    service.timezoneName = jstimezonedetect.determine().name();
    service.tagList = service._getAvailableTagList();
  }

  /** Public **/

  /**
   * Gets/Sets whether the service is ready to request for appointment data or not.
   * For example, we need checked calendar folders/categories for the request.
   */
  get IsReady() {
    return this.isReady;
  }
  set IsReady(value) {
    this.isReady = value;
  }

  get AppointmentList() {
    return this.appointmentList;
  }

  get TrashAppointmentList() {
    return this.trashAppointmentList;
  }

  get AppointmentMap() {
    return this.appointmentMap;
  }

  get OutdatedAppointmentMap() {
    return this.outdatedAppointmentMap;
  }

  /**
   * Appointment repeating options
   */
  get RepeatOptions() {
    return [
      {value: 'NON', text: 'None'},
      {value: 'DAI', text: 'Every Day'},
      {value: 'WEE', text: 'Every Week'},
      {value: 'MON', text: 'Every Month'},
      {value: 'YEA', text: 'Every Year'},
      {value: '', text: 'Custom'}
    ];
  }

  get ReminderOptions() {
    // Populate data for reminder options (alarm)
    let reminderOptions = [];
    let reminders = localStorage.getItem('APPOINTMENT_REMINDER_OPTION');

    if (reminders) {
      reminderOptions = JSON.parse(reminders);
    }
    else {
      // Populate data for reminderOptions
      let reminderOptionTexts = {
        minutes: [1, 5, 10, 15, 30, 45, 60],
        hours: [2, 3, 4, 5, 18],
        days: [1, 2, 3, 4],
        weeks: [1, 2]
      };

      reminderOptions.push({value: 0, text: 'Never'});
      let optionValue = 1;
      for (let i = 0; i < reminderOptionTexts.minutes.length; i++) {
        reminderOptions.push({
          group: 'Minute',
          value: optionValue,
          text: (reminderOptionTexts.minutes[i] === 1 ?
                 reminderOptionTexts.minutes[i] + ' minute' :
                 reminderOptionTexts.minutes[i] + ' minutes') + ' before'
        });

        optionValue++;
      }

      for (let i = 0; i < reminderOptionTexts.hours.length; i++) {
        reminderOptions.push({
          group: 'Hour',
          value: optionValue,
          text: reminderOptionTexts.hours[i] + ' hours before'
        });

        optionValue++;
      }

      for (let i = 0; i < reminderOptionTexts.days.length; i++) {
        reminderOptions.push({
          group: 'Day',
          value: optionValue,
          text: (reminderOptionTexts.days[i] === 1 ?
                 reminderOptionTexts.days[i] + ' day' :
                 reminderOptionTexts.days[i] + ' days') + ' before'
        });

        optionValue++;
      }

      for (let i = 0; i < reminderOptionTexts.weeks.length; i++) {
        reminderOptions.push({
          group: 'Week',
          value: optionValue,
          text: (reminderOptionTexts.weeks[i] === 1 ?
                 reminderOptionTexts.weeks[i] + ' week' :
                 reminderOptionTexts.weeks[i] + ' weeks') + ' before'
        });

        optionValue++;
      }

      // store reminder data to cookies.
      localStorage.setItem('APPOINTMENT_REMINDER_OPTION', JSON.stringify(reminderOptions));
    }

    return reminderOptions;
  }

  /**
   * Appointment display options (fba: free busy actual)
   */
  get DisplayOptions() {
    return [
      {value: 'F', text: 'Free'},
      {value: 'T', text: 'Tentative'},
      {value: 'B', text: 'Busy'},
      {value: 'U', text: 'Out of Office'}
    ];
  }

  /**
   * Send a search request for appointment with given folder ID array and date-range.
   * @param {Date}  startDate start-date for filtering.
   * @param {Date}  endDate   end-date for filtering.
   * @param {Array} folderIds the category/folder IDs (string) to look for.
   */
  getAppointments(startDate, endDate, folderIds, errorCallback) {
    let service = this;

    let batchReq = {};
    let folderProps = [],
      queryProps = '';

    if (angular.isArray(folderIds) && folderIds.length > 0) {
      for (let i = 0; i < folderIds.length; i++) {
        folderProps.push({
          id: folderIds[i]
        });
        queryProps += (i > 0 ? ' OR inid:"' : 'inid:"') + folderIds[i] + '"';
      }
    } else {
      // get all appointments from Calendar default (ID: 10) folder.
      folderProps.push({
        id: '10'
      });
      queryProps = 'inid:"10"';
    }

    // prepare the GetMiniCalRequest
    let getMiniCalReq = {
      '@': {
        xmlns: 'urn:zimbraMail',
        s: startDate.getTime(),
        e: endDate.getTime(),
        folder: folderProps,
        tz: service._getTimezoneForRequest(startDate)
      }
    };

    let searchReq = {
      '@': {
        'xmlns': 'urn:zimbraMail',
        types: 'appointment',
        query: queryProps,
        calExpandInstStart: startDate.getTime(),
        calExpandInstEnd: endDate.getTime(),
        sortBy: 'dateDesc',
        limit: APPT_LIMIT,
        offset: OFFSET
      }
    };

    batchReq.GetMiniCalRequest = getMiniCalReq;
    batchReq.SearchRequest = searchReq;
    HTTP.get(service).post(
      service.apiUrl + '/batchRequest',
      batchReq
    ).success((res) => {
      if (res.getminicalresponse && res.getminicalresponse.date) {
        service._handleMiniCalResponse(res.getminicalresponse.date);
      }

      if (res.searchresponse && res.searchresponse.appt) {
        if (angular.isArray(res.searchresponse.appt)) {
          let appointments = res.searchresponse.appt;

          // HACK: Response returns maybe two appointment with the same id and invid.
          // I'm not quite sure if the second one is the outdated?
          // Because in Zimbra mail, only the first one was displayed.

          for (let appointment of appointments) {
            if (!service.appointmentMap.has(appointment.$.id)) {
              service.appointmentMap.set(appointment.$.id, appointment);

              let instances = service._handleAppointmentData(appointment);
              service.appointmentList.push.apply(service.appointmentList, instances);
            } else {
              service.outdatedAppointmentMap.set(appointment.$.id, appointment);
            }
          }
        } else {
          let appointment = res.searchresponse.appt;

          if (!service.appointmentMap.has(appointment.$.id)) {
            service.appointmentMap.set(appointment.$.id, appointment);

            let instances = service._handleAppointmentData(appointment);
            service.appointmentList.push.apply(service.appointmentList, instances);
          } else {
            service.outdatedAppointmentMap.set(appointment.$.id, appointment);
          }
        }
      }
    }).error((res) => {
      if (typeof errorCallback === 'function') {
        errorCallback(res);
      }
    });
  }

  getAppointmentsFromTrash(errorCallback) {
    let service = this;

    let request = {
      types: 'appointment',
      needExp: 1,
      query: 'inid:3',
      limit: TRASH_LIMIT,
      offset: OFFSET,
      tz: service._getTimezoneForRequest()
    };

    HTTP.get(service).post(
      service.apiUrl + '/searchRequest',
      request
    ).success((res) => {
      if (res.appt) {
        if (angular.isArray(res.appt)) {
          for (let appointment of res.appt) {
            service.trashAppointmentList.push(appointment);
          }
        } else {
          service.trashAppointmentList.push(res.appt);
        }
      }
    }).error((res) => {
      if (typeof errorCallback === 'function') {
        errorCallback(res);
      }
    });
  }

  resetAppointmentData(currentDate, isGetTimeFromDate, isAllDay, userEmail, repeatOptions, reminderOptions) {
    let today = new Date();
    currentDate = angular.isDefined(currentDate) ? new Date(currentDate) : today;

    let startDateTime = new Date();
    let endDateTime = new Date();
    let startHours = new Date().getHours();
    let startMinutes = new Date().getMinutes();
    if (isGetTimeFromDate) {
      // Set Hours for Start Time
      startDateTime = new Date(currentDate.getTime());

      // Set Hours for End Time
      endDateTime = new Date(currentDate.getTime());
      endDateTime.setHours(currentDate.getHours() + 1);
    }
    else {
      if (startMinutes - 30 < 0) {
        startMinutes = 30;
      } else {
        startHours++;
        startMinutes = 0;
      }

      // Set Hours and Minutes for Start Time
      startDateTime.setHours(startHours);
      startDateTime.setMinutes(startMinutes);

      // Set Minutes for End Time = Start Time's Hours + 1
      endDateTime.setHours(startHours + 1);
      endDateTime.setMinutes(startMinutes);
    }

    return {
      fromEmail: userEmail,
      subject: '',
      attendees: [],
      content: '',
      location: '',
      startDate: currentDate,
      startTime: startDateTime,
      startTimeStamp: '',
      endDate: currentDate,
      endTime: endDateTime,
      endTimeStamp: '',
      repeat: repeatOptions.length > 0 ? repeatOptions[0] : '',
      reminder: reminderOptions.length > 0 ? reminderOptions[2] : '',
      attachments: '',
      description: '',
      isAllDay: isAllDay ? isAllDay : false
    };
  }

  populateAppointmentData(appointment, reminderOptions, repeatOptions, displayOptions, calendarTreeViewOptions, isAllDay, userEmail) {
    let service = this;

    service._populateApptDescription(appointment);
    service._populateApptAttendeeList(appointment, userEmail);
    service._populateApptDate(appointment, isAllDay);
    service._populateApptReminder(appointment, reminderOptions);
    service._populateApptRepeatOption(appointment, repeatOptions);
    service._populateApptDisplayOption(appointment, displayOptions);
    service._populateApptCalendarItem(appointment, calendarTreeViewOptions);
  }

  _populateApptReminder(appointment, reminderOptions) {
    appointment.reminder = {};

    if (angular.isDefined(appointment.alarm)) {
      let apptReminder = appointment.alarm.number + ' ' + appointment.alarm.unit + ' before';

      for(let reminder of reminderOptions) {
        if (reminder.text === apptReminder) {
          appointment.reminder = reminder;
        }
      }
    } else {
      appointment.reminder = reminderOptions[0];
    }
  }

  _populateApptRepeatOption(appointment, repeatOptions) {
    appointment.repeat = {};

    if (angular.isDefined(appointment.recur)) {
      let apptRepeat = appointment.recur.freq;

      for(let repeat of repeatOptions) {
        if (repeat.value === apptRepeat) {
          appointment.repeat = repeat;
        }
      }
    } else {
      appointment.repeat = repeatOptions[0];
    }
  }

  _populateApptDisplayOption(appointment, displayOptions) {
    appointment.display = {};

    if (angular.isDefined(appointment.fba)) {
      let apptFba = appointment.fba;

      for(let display of displayOptions) {
        if (display.value === apptFba) {
          appointment.display = display;
        }
      }
    } else {
      appointment.display = {value: 'B', text: 'Busy'};
    }
  }

  _populateApptCalendarItem(appointment, calendarTreeViewOptions) {
    appointment.calendarTreeViewSelectedId = appointment.ciFolder;
    if (angular.isDefined(appointment.calItemId)) {
      let calItemId = appointment.calItemId;

      for(let calItem of calendarTreeViewOptions) {
        if (calItem.id === calItemId) {
          appointment.calendarTreeViewSelectedId = calItem.id;
        }
      }
    } else {

    }
  }

  /**
   * Prepare the HTML format for Appointment Message content.
   * @param {object} appointment [[Description]]
   */
  _populateApptDescription(appointment) {
    let service = this;
    let apptDetailContent = null;
    appointment.content = '';
    if (angular.isDefined(appointment.htmlDesc) && appointment.htmlDesc !== '') {
      apptDetailContent = appointment.htmlDesc;
    } else {
      if (angular.isDefined(appointment.description) && appointment.description !== '') {
        apptDetailContent = appointment.description;
      } else if (angular.isDefined(appointment.body) && appointment.body !== '') {
        apptDetailContent = appointment.body;
      }
    }

    if (apptDetailContent !== null && angular.isDefined(apptDetailContent)) {
      // Check if the current appointment is for invitation and content unneeded meta info.
      let indexOfMetaDevide = apptDetailContent.lastIndexOf('*~*~*~*~*~*~*~*~*~*</div>');
      if (indexOfMetaDevide !== -1) {
        apptDetailContent = apptDetailContent.substring(indexOfMetaDevide + 25,
                                                        apptDetailContent.length);
      }

      indexOfMetaDevide = apptDetailContent.lastIndexOf('*~*~*~*~*~*~*~*~*~*');
      if (indexOfMetaDevide !== -1) {
        apptDetailContent = apptDetailContent.substring(indexOfMetaDevide + 19,
                                                        apptDetailContent.length);
      }

      // Update image attributes
      if (apptDetailContent.indexOf('dfsrc="') > 0) {
        apptDetailContent = apptDetailContent.replace(/dfsrc="/g, 'src="');

        // Get the width of content.
        let contentWidth = angular.element(document.querySelector('.appt-detail-content')).children().eq(0).prop('offsetWidth');
        let tempHtmlElements = angular.element(apptDetailContent);
        let tempHtmlString = '';

        // Reach each image element and check the image size
        // then we can set it to scale with the view if needed.
        for (let i = 0; i < tempHtmlElements.find('img').length; i++) {
          if (tempHtmlElements.find('img').eq(i).prop('width') > contentWidth) {
            tempHtmlElements.find('img').eq(i).attr('width', '100%').attr('height', 'auto');
          }
        }

        for (let i = 0; i < tempHtmlElements.length; i++) {
          tempHtmlString += tempHtmlElements.eq(i).prop('outerHTML');
        }

        apptDetailContent = tempHtmlString;
      }

      apptDetailContent = service._updateStyleForApptDescription(apptDetailContent);
      appointment.content = SCE.get(service).trustAsHtml(apptDetailContent);
    }
  }

  _updateStyleForApptDescription(desString) {
    let result = desString;
    let firstDivIndex = desString.indexOf('<div');

    // Check if returned content is HTML, then get the first DIV
    if (firstDivIndex > -1) {
      // Add styles for first div
      result = [desString.slice(0, firstDivIndex + 4),
                ' style="word-wrap: break-word" ',
                desString.slice(firstDivIndex + 4)].join('');
    }

    return result;
  }

  _populateApptAttendeeList(appointment, userEmail) {
    if (angular.isDefined(appointment.attendee) &&
        (appointment.attendee || appointment.attendee.length > 0)) {

      let tempAttendeeList = appointment.attendee;

      // If attendee is not an array, push that object to a temp array to work
      if (!angular.isArray(appointment.attendee)) {
        tempAttendeeList = [];
        tempAttendeeList.push(appointment.attendee);
      }

      appointment.attendees = [];
      for (let attendee of tempAttendeeList) {
        // Check if appt detail is an invitation
        if (attendee.$.a === userEmail && appointment.organizer !== userEmail) {
          // Current user is an attendee --> should show the invitation view
          appointment.isInvitation = true;

          // Set buttons color in the invitation view depends on the reply to the invitation
          // User accepted
          if (attendee.$.ptst === 'AC') {
            appointment.isUserAccepted = true;
          }

          // User accepted tentatively
          if (attendee.$.ptst === 'TE') {
            appointment.isUserAcceptedTentatively = true;
          }
        }

        // push attendee to attendees for first next appointment component
        if (attendee.$) {
          appointment.attendees.push({
            display: attendee.$.d + ' <' + attendee.$.a + '>',
            email: attendee.$.a,
            name: attendee.$.d
          });
        }
      }
    }
  }

  _populateApptDate(appointment, isAllDay) {
    appointment.isAllDay = isAllDay;

    // Get appt detail current date time
    if (isAllDay) {
      // All day appointment, it doesn't have specific start and end time
      // So we need to set it manually
      let dateString = appointment.s.d;
      let year = dateString.substring(0, 4);
      let month = dateString.substring(4, 6);
      let day = dateString.substring(6, 8);

      appointment.startDate = appointment.endDate = new Date(year, month - 1, day);
    } else {
      // Get appt detail start date time
      if (appointment.s && appointment.s.u) {
        appointment.startDate = appointment.startTime = new Date(Number(appointment.s.u));
      }

      // Get appt detail start date time
      if (appointment.e && appointment.e.u) {
        appointment.endDate = appointment.endTime = new Date(Number(appointment.e.u));
      }
    }
  }

  prepareRequestForSavingAppointment (appointment, isEdit, inviteId) {
    let service = this;

    // 1. Split attendees of appointment
    let attendees = [];
    let emailInfo = [];
    if (appointment.attendees && appointment.attendees.length > 0) {
      for (let attendee of appointment.attendees) {
        attendees.push({
          'role': 'REQ',
          'ptst': 'NE',
          'rsvp': '1',
          'a': attendee.email,
          'd': attendee.name
        });

        emailInfo.push({
          'a': attendee.email,
          'p': '',
          't': 't'
        });
      }
    }

    // 2. Convert value of start date time
    let startTimeStamp = '';
    if (appointment.startDate && appointment.startTime) {
      let startDate = appointment.startDate.getDate();
      let startMonth = (appointment.startDate.getMonth() + 1);
      let startYear = appointment.startDate.getFullYear();

      let startHours = appointment.startTime.getHours();
      let startMinutes = appointment.startTime.getMinutes();

      appointment.startTimeStamp = (new Date(startYear,
                                             startMonth - 1,
                                             startDate,
                                             startHours,
                                             startMinutes, 0, 0)).getTime();
      startTimeStamp = startYear.toString() +
        (startMonth < 10 ? ('0' + startMonth.toString()) : startMonth.toString()) +
        (startDate < 10 ? ('0' + startDate.toString()) : startDate.toString()) +
        'T' +
        (startHours < 10 ? ('0' + startHours.toString()) : startHours.toString()) +
        (startMinutes < 10 ? ('0' + startMinutes.toString()) : startMinutes.toString()) +
        '00';
    }

    // 3. Convert value of end date time
    let endTimeStamp = '';
    if (appointment.endDate && appointment.endTime) {
      let endDate = appointment.endDate.getDate();
      let endMonth = (appointment.endDate.getMonth() + 1);
      let endYear = appointment.endDate.getFullYear();

      let endHours = appointment.endTime.getHours();
      let endMinutes = appointment.endTime.getMinutes();

      appointment.endTimeStamp = (new Date(endYear,
                                           endMonth - 1,
                                           endDate,
                                           endHours,
                                           endMinutes, 0, 0)).getTime();
      endTimeStamp = endYear.toString() +
        (endMonth < 10 ? ('0' + endMonth.toString()) : endMonth.toString()) +
        (endDate < 10 ? ('0' + endDate.toString()) : endDate.toString()) +
        'T' +
        (endHours < 10 ? ('0' + endHours.toString()) : endHours.toString()) +
        (endMinutes < 10 ? ('0' + endMinutes.toString()) : endMinutes.toString()) +
        '00';
    }

    // 4. Prepare InviteInfo
    let inviteInfo = service._prepareInviteInfo(appointment, attendees, startTimeStamp, endTimeStamp);

    // Return request's options
    let options = {
      'folderId': appointment.calendarTreeViewSelectedId,
      'inviteInfo': inviteInfo,
      'emailInfo': emailInfo,
      'subject': appointment.subject,
      'mp': {
        'mp': [
          {
            'ct': 'text/plain',
            'content': appointment.content
          },
          {
            'ct': 'text/html',
            'content': appointment.content
          }
        ],
        'ct': 'multipart/alternative'
      }
    };

    if (isEdit && angular.isDefined(inviteId)) {
      options.id = inviteId;
    }

    return options;
  }

  _prepareInviteInfo(appointment, attendees, startTimeStamp, endTimeStamp) {
    // Prepare repeating info.
    let service = this;

    let inviteInfo = [
      {
        'at': attendees,
        'status': 'CONF',
        'fba': appointment.display.value,
        'fb': appointment.display.value,
        'class': 'PUB',
        'transp': 'O',
        'draft': 0,
        'allDay': appointment.isAllDay ? '1' : '0',
        's': {
          'tz': service.timezoneName,
          'd': startTimeStamp
        },
        'e': {
          'tz': service.timezoneName,
          'd': endTimeStamp
        },
        'name': appointment.subject,
        'loc': appointment.location,
        'or': {
          'a': appointment.fromEmail
        },
        'ciFolder': appointment.calendarTreeViewSelectedId
      }
    ];

    // If this appointment need to be remind
    if (appointment.reminder.value !== undefined && appointment.reminder.value !== 0) {
      inviteInfo[0].alarm = service._prepareAlarmInfo(appointment);
    }

    // If this is a repeating appointment
    if (appointment.repeat.value !== undefined && appointment.repeat.value !== 'NON') {
      inviteInfo[0].recur = service._prepareRecurInfo(appointment);
    }

    return inviteInfo;
  }

  _prepareAlarmInfo(appointment) {
    let alarmArray = appointment.reminder.text.split(' ');
    let alarmInfo = [
      {
        'action': 'DISPLAY',
        'trigger': {
          'rel': {
            'related': 'START',
            'neg': '1'
          }
        }
      }
    ];

    switch(alarmArray[1]) {
      case 'weeks':
      case 'week':
        alarmInfo[0].trigger.rel.w = alarmArray[0];
        break;
      case 'days':
      case 'day':
        alarmInfo[0].trigger.rel.d = alarmArray[0];
        break;
      case 'hours':
      case 'hour':
        alarmInfo[0].trigger.rel.h = alarmArray[0];
        break;
      case 'minutes':
      case 'minute':
        alarmInfo[0].trigger.rel.m = alarmArray[0];
        break;
      case 'seconds':
      case 'second':
        alarmInfo[0].trigger.rel.s = alarmArray[0];
        break;
    }

    return alarmInfo;
  }

  _prepareRecurInfo(appointment) {
    let recurInfo = {
      'add': {
        'rule': {
          'interval': {
            'ival': 1
          },
          'freq': appointment.repeat.value
        }
      }
    };

    if (angular.isDefined(appointment.recurUntil)) {
      recurInfo.add.rule.until = {
        d: appointment.recurUntil
      };
    }

    return recurInfo;
  }

  deleteThisAndFutureInstance(id, thisInstance) {
    let service = this;

    if (thisInstance !== null && angular.isDefined(thisInstance) && thisInstance.length > 0) {
      // Get Appt deail
      service._getAppointmentDetailForDeleting(id, thisInstance);
    }
  }

  _getAppointmentDetailForDeleting(inviteId, thisInstance) {
    let service = this;

    // UNDONE: Comment temporarily for fixing the Circular Dependency issue mailService -> calendarService -> mailService
//    service.mailService.getAppointmentDetail(inviteId, (response) => {
//      if (response[0] === null || !angular.isDefined(response[0])) {
//        return;
//      }
//
//      /* Appointment detail object
//       response = [{
//         'id'
//         'attendee' // attendee list
//         'name' // subject / title
//         'location'
//         'body'
//         'description'
//         'calItemId' // calendar item id
//         'apptId'
//         'status' // TENT|CONF|CANC|NEED|COMP|INPR|WAITING|DEFERRED
//                  // TENTative, CONFirmed, CANCelled, COMPleted, INPRogress, WAITING, DEFERRED
//         'ciFolder'
//         'class' // PUB|PRI|CON. i.e. PUBlic (default), PRIvate, CONfidential
//         's' // start date time
//         'htmlDesc'
//         'organizer'
//         'e' // end date time
//         'at' // attendee list - duplicate with 'attendee', but without $
//         'attachment' // attachments
//         'apiUrl' // vncConstant.API_URL
//         'alarm' // alarm / reminder
//         'recur' // recur / repeat
//         'fba' // free-busy actual
//         'allDay' // is all day
//       }]; */
//
//      let appointment = response[0];
//      if (appointment) {
//        appointment.subject = appointment.name;
//        appointment.fromEmail = service.authUser;
//
//        // Populate data for appointment
//        service.populateApptData(
//          appointment,
//          service.ReminderOptions, service.RepeatOptions, service.DisplayOptions,
//          service._populateCalendarTreeViewOptions(appointment),
//          appointment.allDay, service.authUser);
//
//        // Prepare request for delete this and funture instance (modify appt with adding until into recurInfo)
//        appointment.recurUntil = service.calculateRecurUntilValue(thisInstance);
//        let options = service.prepareRequestForSavingAppointment(appointment, true, inviteId);
//
//        // Update appointment with recur until value
//        service._updateAppointment(options);
//      }
//    }).catch((error) => {
////      logger.error(error, error); We should call the log from the controller.
//    });
  }

  _updateAppointment(options) {
    let service = this;

    // UNDONE: Comment temporarily for fixing the Circular Dependency issue mailService -> calendarService -> mailService
//    service.mailService.modifyAppointment(options, (response) => {
////      logger.info('1 appointment deleted.');
//    }).catch((error) => {
////      logger.error(error, error);
//    });
  }

  calculateRecurUntilValue(thisInstance) {
    // thisInstance = '20160121T000000Z';
    // --> recurUntilValue = '20160120T000000Z' = thisInstance - 1 (day);

    let recurUntilValue = '';
    let dateString = thisInstance.substring(0, thisInstance.indexOf('T'));
    let year = dateString.substring(0, 4);
    let month = dateString.substring(4, 6);
    let day = dateString.substring(6, 8);
    let thisInstanceDate = new Date(year, month - 1, day);

    let recurUntilDate = new Date(thisInstanceDate.getTime() + (-1) *24*60*60*1000);
    recurUntilDate = new Date(recurUntilDate.setHours(23,59,59,999));

    let recurUntilYear = recurUntilDate.getFullYear();
    let recurUntilMonth = recurUntilDate.getMonth() + 1;
    recurUntilMonth = recurUntilMonth < 10 ? '0' + recurUntilMonth : recurUntilMonth;
    let recurUntilDay = recurUntilDate.getDate();
    recurUntilDay = recurUntilDay < 10 ? '0' + recurUntilDay : recurUntilDay;

    recurUntilValue = recurUntilYear.toString() + recurUntilMonth.toString() + recurUntilDay.toString() + 'T235959Z';

    return recurUntilValue;
  }

//  _populateCalendarTreeViewOptions(appointment) {
//    let calendarTreeViewOptions = [];
//    let calendarTreeView = localStorage.getItem('CALENDAR_TREE_VIEW');
//
//    if (calendarTreeView) {
//      calendarTreeViewOptions = parseTreeViewToArray(JSON.parse(calendarTreeView));
//
//      appointment.calendarTreeViewSelectedId = calendarTreeViewOptions[0].id;
//      appointment.calendarTreeViewSelectedStyles = calendarTreeViewOptions[0].icon.color;
//    }
//
//    return calendarTreeViewOptions;
//  }
  // #endregion

  // #region Calendar's Folders
//  populateSelectedCalendarFolderList(calendarTreeView) {
//    if (angular.isUndefined(calendarTreeView)) {
//      calendarTreeView = JSON.parse(localStorage.getItem('CALENDAR_TREE_VIEW'));
//    }
//
//    let calendarTreeList = parseTreeViewToArray(calendarTreeView);
//    let filteredNodeForCalendar = [];
//
//    // remove the last node in list (the last node is Trash)
//    calendarTreeList.pop();
//
//    // reach all the list to filter the selecting node
//    angular.forEach(calendarTreeList, (node, index)=>{
//      if(node.isSelected){
//        filteredNodeForCalendar.push(node);
//      }
//    });
//
//    return filteredNodeForCalendar;
//  }

//  changeFolderSelection (folderId, isSelected) {
//    let option = isSelected ? 'check' : '!check';
//
//    mailService.makeFolderAction(folderId, option, (response, error) => {
//      if (angular.isDefined(error) && error.status === 'failed') {
//        logger.error(error.msg);
//      }
//    });
//  }

  /** Private **/

  /**
   * Returns timezone object for requesting.
   * @param {object} date The date to get timezone infos from.
   * @return {object} An object contains timezone's name and the standard offset in minutes.
   */
  _getTimezoneForRequest(date) {
    let service = this;

    return {
      id: service.timezoneName,
      stdoff: date ? date.getTimezoneOffset() : new Date().getTimezoneOffset()
    };
  }

  /**
   * Filter appointment data for displaying.
   * If an appointment is recuring, clone it with `inst` property and
   * Eliminate all outdated appointments.
   * @param {object} appointment The appointment data returned from Zimbra.
   */
  _handleAppointmentData(appointment) {
    let service = this;
    let tempApptList = [];

    if (appointment.$.recur && angular.isArray(appointment.inst)) {

      let clonedAppt = angular.copy(appointment);
      delete clonedAppt.inst;

      for (let instance of appointment.inst) {
        clonedAppt.inst = instance; // this will help when delete an instance of the appointment
        tempApptList.push(clonedAppt);
      }

      //      service.appointmentList = tempApptList
    } else {
      tempApptList.push(appointment);
    }

    return tempApptList;
  }

  /**
   * [[Description]]
   * @param {Array} dates The shot-date display string list. Eg ['20160104', '20160118']
   */
  _handleMiniCalResponse(dates) {
    // UNDONE: haven't got any data to process yet.
    let service = this;
  }

  _prepareTagForAppointment(tagId, tagName) {
    let service = this;
    let tagList = service.tagList,
        tags = [];

    let tagIds = tagId.split(',');

    angular.forEach(tagIds, (id) => {
      angular.forEach(tagList, (tagItem) => {
        if (tagItem.$.id === id) {
          tags.push(tagItem);
        }
      });
    });

    return tags;
  }

  _getAvailableTagList() {
    let tagList = localStorage.getItem('tagList');

    if (angular.isDefined(tagList) && tagList !== null) {
      tagList = JSON.parse(tagList);
    }
    else {
      tagList = [];
    }

    return tagList;
  }
}

export default CalendarSerivce;
