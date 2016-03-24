const UIBMODAL = new WeakMap();
const Q = new WeakMap();
const SCOPE = new WeakMap();
const LOGGER = new WeakMap();
const MODALINSTANCE = new WeakMap();

class RecoverCalendarDeletedItemsController {
  constructor($modalInstance, $uibModal, $q, $scope, $timeout, logger, mailService) {
    UIBMODAL.set(this, $uibModal);
    Q.set(this, $q);
    SCOPE.set(this, $scope);
    LOGGER.set(this, logger);
    MODALINSTANCE.set(this, $modalInstance);

    this.mailService = mailService;
    this.timeout = $timeout;
    this.$ = angular.element;

    this.deletedItems = [];

    this._activate();

    $scope.$on('CHOOSE_FOLDER_MODAL_CLOSED', (e, value) => {
      this.recover(value);
    });
  }

  _activate() {
    //LOGGER.get(this).info('activated');
    this.getDeletedItems();
  }

  _truncate(content) {
    var lengthToCut = 70;
    var result = content;
    if (content && content.length > lengthToCut) {
      result = content.substring(0, lengthToCut) + '...';
    }

    return result;
  }

  close() {
    MODALINSTANCE.get(this).dismiss('cancel');
  }

  getDeletedItems() {
    let request = {
      types: 'appointment',
      limit: 50,
      offset: 0,
      query: '-in:/Junk',
      sortBy: 'dateDesc'
    };

    this.mailService.searchRequest(request, (response) => {
      if(response && response.appt) {
        let tempArray = [];
        if(!angular.isArray(response.appt)) {
          tempArray.push(response.appt);
        } else {
          tempArray = response.appt;
        }

        for(let deletedItem of tempArray) {
          this.deletedItems.push({
            id: deletedItem.$.id,
            invId: deletedItem.$.invId,
            name: this._truncate(deletedItem.$.name),
            date: deletedItem.$.d,
            isSelected: false
          });
        }
      }
    }).catch((error) => {
      LOGGER.get(this).error(error, error, 'Error occurs while getting calendar deleted items to recover.');
    });
  }

  executeRecoverTo() {
    let selectedDeletedItems = [];
    //LOGGER.get(this).info('recoverTo');
    for(let deletedItem of this.deletedItems) {
      if (deletedItem.isSelected) {
        selectedDeletedItems.push(deletedItem);
      }
    }

    if (selectedDeletedItems.length > 0) {
      // Show a list of the calendar folders for choosing to recover
      this.timeout(() => {
        this.$('#choose-calendar-folder').find('#modal').trigger('click');
      }, 100);
    }
  }

  recover(selectedFolderId) {
    let selectedItemIds = '';
    let tempDeletedItems = [];

    // Get the Id list of selected deleted items
    for (let deletedItem of this.deletedItems) {
      if (deletedItem.isSelected) {
        //selectedItemIds += deletedItem.id + ',';
        selectedItemIds += deletedItem.invId + ',';
      } else {
        tempDeletedItems.push(deletedItem);
      }
    }

    // Remove the last comma
    if (selectedItemIds.endsWith(',')) {
      selectedItemIds = selectedItemIds.substring(0, selectedItemIds.length - 1);
    }

    // Call to service API to recover
    this.mailService.recoverDeletedAppointments(selectedItemIds, selectedFolderId, (response) => {
      if (response.status !== 'failed') {
        // refresh the deleted items
        this.deletedItems = tempDeletedItems;
        // LOGGER.get(this).info('Items copied.');
      }
    }).catch((error) => {
      LOGGER.get(this).error(error, error, 'Error occurs while recovering calendar deleted items.');
    });
  }

  rowSelected() {
    // LOGGER.get(this).info('rowSelected');
  }
}

export default RecoverCalendarDeletedItemsController;
