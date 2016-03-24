//import deleteAppointmentTemplate from './view.deleteApptModal.html';
//import newAppointmentTemplate from './../calendar.compose/compose.html';
//import newAppointmentController from './../calendar.compose/compose.controller.es6';

const LOGGER = new WeakMap();
const MD_DIALOG = new WeakMap();
const SCOPE = new WeakMap();
const STATE = new WeakMap();
//const UIBMODAL = new WeakMap();
const TIMEOUT = new WeakMap();

class CalendarViewController {
  /* @ngInject */
  constructor($scope, $state, $stateParams, $timeout, $mdDialog, auth, calendarService, sidebarCalendarFolderService,
              calendarViewService, logger, mailService, moment) {
    // data initialization

    let vm = this;
    LOGGER.set(vm, logger);
    SCOPE.set(vm, $scope);
    STATE.set(vm, $state);
    MD_DIALOG.set(vm, $mdDialog);
    //UIBMODAL.set(vm, $uibModal);
    TIMEOUT.set(vm, $timeout);

    vm.dayFormat = "d";

    // To select a single date, make sure the ngModel is not an array.
    vm.selectedDate = null;

    // If you want multi-date select, initialize it as an array.
    vm.selectedDate = [];

    vm.firstDayOfWeek = 0; // First day of the week, 0 for Sunday, 1 for Monday, etc.
    vm.setDirection = function (direction) {
      vm.direction = direction;
      vm.dayFormat = direction === "vertical" ? "EEEE, MMMM d" : "d";
    };

    vm.dayClick = function (date) {
      vm.msg = "You clicked " + $filter("date")(date, "MMM d, y h:mm:ss a Z");
    };

    vm.prevMonth = function (data) {
      vm.msg = "You clicked (prev) month " + data.month + ", " + data.year;
    };

    vm.nextMonth = function (data) {
      vm.msg = "You clicked (next) month " + data.month + ", " + data.year;
    };

    vm.tooltips = true;
    vm.setDayContent = function (date) {

      // You would inject any HTML you wanted for
      // that particular date here.
      return "<p>test</p>";

      //// You could also use an $http function directly.
      //return $http.get("/some/external/api");
      //
      //// You could also use a promise.
      //var deferred = $q.defer();
      //$timeout(function () {
      //  deferred.resolve("<p></p>");
      //}, 1000);
      //return deferred.promise;
    };

    vm.apptToDelete = undefined;
    vm.isCellOpen = true;
    vm.calendarTitle = 'Calendar';
    vm.calendarDay = moment().toDate();
    vm.calendarFolderList = [];
    vm.calendarView = 'month';
    vm.isShowWorkWeek = false;
    vm.isCalendarView = true;

    let date = new Date();
    let d = date.getDate();
    let m = date.getMonth();
    let y = date.getFullYear();
    let viewType = $stateParams.viewType;
    vm.calendarControl = viewType;

    // service initialization
    vm.auth = auth;
    vm.mailService = mailService;
    vm.calendarService = calendarService;
    vm.calendarFolderService = sidebarCalendarFolderService;
    vm.calendarViewService = calendarViewService;
    vm.service = calendarService;

//    SCOPE.get(vm).$watchCollection(() => {
//      return calendarService.appointmentList;
//    }, (newApptList, oldApptList) => {
//      if (angular.isDefined(newApptList) && angular.isArray(newApptList) && newApptList.length > 0) {
//        vm.events = calendarService.getCalendarEventsFromAppointments(newApptList);
//      }
//    });

    // listen compose button click
    SCOPE.get(vm).$on('compose:event', () => {
      $timeout(()=> {
        this.createNewAppointment(false, false);
      }, 100);
    });

//    SCOPE.get(vm).$on('CALENDAR_FOLDER_AFTER_SELECTED', (e, params) => {
//      let calendarTreeView = params.treeView;
//      let selectedNode = params.selectedNode;
//      this.calendarFolderList = this.service.populateSelectedCalendarFolderList(calendarTreeView);
//      this.service.getAppointmentsFromDateRange(this.service.requestStartDateTime, this.service.requestEndDateTime,
//        this.calendarFolderList);
//
//      // Pass in folderId and isSelected
//      this.service.changeFolderSelection(selectedNode.id, selectedNode.isSelected);
//    });

    this.activate();
  }

  activate() {
//    this.calendarFolderList = this.service.populateSelectedCalendarFolderList();
//    this.service.getAppointmentsFromDateRange(this.service.requestStartDateTime, this.service.requestEndDateTime, this.calendarFolderList);
    let vm = this;

    SCOPE.get(vm).$watchCollection(() => {
      return vm.calendarService.AppointmentList;
    }, (newApptList, oldApptList) => {
      if (angular.isDefined(newApptList)) {
        vm.events = vm.calendarViewService.generateCalendarEvents(newApptList);
      }
    });
  }

  goToList() {
    STATE.get(this).go('calendar.list');
  }

  eventClicked(event) {
    this.showModal('Clicked', event);
  }

  eventEdited(event) {
    //this.showModal('Edited', event);
    TIMEOUT.get(this)(()=> {
      this.createNewAppointment(true, event.allDay === '1' ? true : false, event.inviteId);
    }, 100);
  }

  eventDeleted(event) {
    this.apptToDelete = event;
    var modalInstance = UIBMODAL.get(this).open({
      animation: true,
      backdrop: 'static',
      template: deleteAppointmentTemplate,
      controller: ['$rootScope', '$scope', '$modalInstance', 'isRepeating', this._deleteApptModalController],
      resolve: {
        isRepeating: event.recur ? event.recur : false
      }
    });

    modalInstance.result.then((deleteApptData) => {
      let emailInfo = null;
      if (deleteApptData.isSendCancellation) {
        emailInfo = this._prepareEmailInfoForDeleteAppointment();
      }

      if (deleteApptData.isDeletingSeries) {
        // TODO: prepare data for delete all appt in a series
        this.mailService.deleteAppointment(this.apptToDelete.apptId, (response, error) => {
          if (error) {
            LOGGER.get(this).error(error.msg);
          }
          else {

          }
        });
      } else {
        // TODO: prepare data for delete this instance
        let options = {
          id: this.apptToDelete.apptId,
          updateOrganizer: true,
          idnt: '',
          inviteInfo: emailInfo,
          cancelInfo: {}
        };

        this.mailService.deleteInstance(options, (response, error) => {
          if (error) {
            LOGGER.get(this).error(error.msg);
          }
          else {

          }
        });
      }
    });
  }

  calendarTimeSlotOnClicking(event) {
    this.createNewAppointment(false, event.isAllDay, undefined, event.date, event.folderId);
  }

  _prepareEmailInfoForDeleteAppointment() {
    let emailInfo = null;

    if (angular.isDefined(this.apptToDelete) && angular.isDefined(this.apptToDelete.attendees)) {
      emailInfo = {
        e: [],
        su: 'Cancelled: ' + this.apptToDelete.title,
        mp: {
          mp: [
            {
              ct: 'text/plain',
              content: ''
            },
            {
              ct: 'text/html',
              content: ''
            }
          ],
          ct: 'multipart/alternative'
        }
      };

      // Service could return an object or an array.
      // TODO: service should handle backend results for consistent usage in frontend
      if (angular.isArray(this.apptToDelete.attendees)) {
        for (let attendee of this.apptToDelete.attendees) {
          emailInfo.e.push({
            a: attendee.a,
            t: 't'
          });
        }
      } else {
        emailInfo.e.push({
          a: attendee.a,
          t: 't'
        });
      }
    }

    return emailInfo;
  }

  _deleteApptModalController($rootScope, $scope, $modalInstance, isRepeating) {
    $scope.isRepeating = isRepeating;

    $scope.delete = () => {
      let deleteApptData = {
        isSendCancellation: $scope.isSendCancellation,
        isDeletingSeries: false
      };

      $modalInstance.close(deleteApptData);
    };

    $scope.deleteSeries = () => {
      let deleteApptData = {
        isSendCancellation: $scope.isSendCancellation,
        isDeletingSeries: true
      };

      $modalInstance.close(deleteApptData);
    };

    $scope.cancel = () => {
      $modalInstance.dismiss('cancel');
    };
  }

  eventTimesChanged(event) {
    this.showModal('Dropped or resized', event);
  }

  toggle($event, field, event) {
    $event.preventDefault();
    $event.stopPropagation();
    event[field] = !event[field];
  }

  showModal(action, event) {
    UIBMODAL.get(this).open({
      templateUrl: 'modalContent.html',
      controller: function () {
        var vm = this;
        vm.action = action;
        vm.event = event;
      },
      controllerAs: 'vm'
    });
  }

  createNewAppointment(isEdit, isAllDay, inviteId, currentDate, folderId, existingAppointmentObject) {
    let title = '',
      size = '',
      isQuickMode = false,
      isGetTimeFromDate = false;

    if (angular.isDefined(currentDate)) {
      isGetTimeFromDate = true;
      isQuickMode = true;
      size = 'md';
      title = 'Quick Add Appointment';
    } else {
      title = isEdit ? 'Edit Appointment' : 'Create New Appointment';
      size = 'lg';
    }

    let uibModalInstance = UIBMODAL.get(this).open({
      animation: true,
      backdrop: 'static',
      template: newAppointmentTemplate,
      windowClass: 'app-modal-window',
      controller: ['$cookies', '$filter', '$modalInstance', '$rootScope', '$sce', '$scope', '$state', 'auth', 'calendarService',
        'jstimezonedetect', 'logger', 'mailService', 'moment', 'resolveModal', newAppointmentController],
      controllerAs: 'vm',
      bindToController: true,
      keyboard: true,
      backdropClick: true,
      size: size,
      resolve: {
        resolveModal: {
          isAllDay: isAllDay,
          isQuickMode: isQuickMode,
          title: title,
          isEdit: isEdit,
          inviteId: inviteId,
          folderId: folderId,
          currentDate: currentDate,
          isGetTimeFromDate: isGetTimeFromDate,
          existingAppointmentObject: existingAppointmentObject || undefined
        }
      }
    });

    uibModalInstance.result.then((response) => {
      if (response.openFullMode) {
        this.createNewAppointment(false, false, undefined, undefined, undefined, response.existingAppointmentObject);
      }
    });
  }
}

export default CalendarViewController;
