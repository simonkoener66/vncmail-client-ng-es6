class CalendarViewService {
  constructor() {

  }

  generateCalendarEvents(appointments) {
    let events = [];
    for (let appointment of appointments) {
      let startTime = angular.isArray(appointment.inst) ? appointment.inst[0].$.s : appointment.inst.$.s;

      events.push({
        // The title of the event
        title: appointment.$.name,
        /* The type of the event (determines its color). So let's use the folder ID for color
         * TODO: get folder color from folder ID
         */
        type: appointment.$.l ? 'info' : 'important',
        /* `md` is the date timestamp when the appointment was modified.
         * `d` is the time timestamp when the appointment was created.
         */
        startsAt: new Date(Number(startTime)),
        endsAt: new Date(Number(startTime) + Number(appointment.$.dur)), // Optional - a javascript date object for when the event ends
        editable: false, // If edit-event-html is set and this field is explicitly set to false then dont make it editable.
        deletable: false, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable
        draggable: true, // Allow an event to be dragged and dropped
        resizable: true, // Allow an event to be resizable
        incrementsBadgeTotal: true, // If set to false then will not count towards the badge total amount on the month and year view
        // TODO: Fixed the calendar recur (with Week and day)
        recursOn: appointment.$.recur ? 'year' : 'month', // If set the event will recur on the given period. Valid values are year or month
        cssClass: 'a-css-class-name' // A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
      })
    }

    return events;
  }
}

export default CalendarViewService;
