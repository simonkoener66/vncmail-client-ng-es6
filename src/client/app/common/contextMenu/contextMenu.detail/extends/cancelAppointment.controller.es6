const JSTIMEZONE = new WeakMap(); // for time-zone detected.
const LOGGER = new WeakMap();
const MODAL = new WeakMap();
const ROOTSCOPE = new WeakMap();

class CancelAppointmentController {
  /* @ngInject */
  constructor($rootScope, $modalInstance, jstimezonedetect, logger, calendarService, mailService, sidebarService) {
    JSTIMEZONE.set(this, jstimezonedetect);
    LOGGER.set(this, logger);
    MODAL.set(this, $modalInstance);
    ROOTSCOPE.set(this, $rootScope);
    this.calendarService = calendarService;
    this.mailService = mailService;
    this.sidebarService = sidebarService;

    this.deleteApptSeriesMode = {
      selected: 1
    };
  }

  cancel() {
    MODAL.get(this).dismiss('cancel');
  }

  editMessage() {

  }

  /**
   * Delete an Appointment's instance.
   */
  sendCancellation() {
    let appointment = this.sidebarService.currentAppointment,
      tz = JSTIMEZONE.get(this).determine().name();

    let id = appointment.inviteId,
      emailInfo = {
        e: appointment.emailInfo,
        su: 'Cancelled: ' + appointment.title,
        mp: {
          mp: [
            {
              ct: 'text/plain',
              content: 'Cancelled.'
              }, {
              ct: 'text/html',
              content: 'Cancelled.'
              }
            ],
          ct: 'multipart/alternative'
        }
      },
      instance = {
        d: appointment.instances.$.ridZ,
        tz: tz
      };

    this.mailService.cancelOneInstanceAppointment(id, emailInfo, instance, (res) => {
      if (res.$) {
        // Succeeded
        // Close modal and passing value to target.
        // LOGGER.get(this).info('Instance of ' + appointment.title + ' was deleted.');
        ROOTSCOPE.get(this).$broadcast('APPOINTMENT_DELETED');

        // Close modal.
        MODAL.get(this).close(res.$);
      } else {
        LOGGER.get(this).error(res, res, 'Error occurs while tryng to delete an instance of ' + appointment.title);
        MODAL.get(this).close(res);
      }
    });
  }

  deleteAppointmentSeries() {
    let appointment = this.sidebarService.currentAppointment,
      tz = JSTIMEZONE.get(this).determine().name(),
      id = appointment.inviteId,
      instance = {
        d: appointment.instances.$.ridZ,
        tz: tz
      };

    let emailInfo = {
      e: appointment.emailInfo,
      su: 'Cancelled: ' + appointment.title,
      mp: {
        mp: [
          {
            ct: 'text/plain',
            content: 'Cancelled.'
              }, {
            ct: 'text/html',
            content: 'Cancelled.'
              }
            ],
        ct: 'multipart/alternative'
      }
    };

    if (this.deleteApptSeriesMode.selected === 1) {
      this.mailService.cancelOwnAppointment(id, emailInfo, (res) => {
        if (res.$) {
          // Suceeded
          // Close modal and passing value to target.
          // LOGGER.get(this).info('Series of ' + appointment.title + ' was deleted.');
          ROOTSCOPE.get(this).$broadcast('APPOINTMENT_DELETED');

          // Close modal.
          MODAL.get(this).close(res.$);
        } else {
          LOGGER.get(this).error(res, res, 'Error occurs while tryng to delete a series of ' + appointment.title);
          MODAL.get(this).close(res);
        }
      });
    }

    if (this.deleteApptSeriesMode.selected === 2) {
      this.calendarService.deleteThisAndFutureInstance(id, instance);
    }
  }
}

export default CancelAppointmentController;
