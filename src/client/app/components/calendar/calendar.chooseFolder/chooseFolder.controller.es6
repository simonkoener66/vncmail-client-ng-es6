const UIBMODAL = new WeakMap();
const Q = new WeakMap();
const ROOTSCOPE = new WeakMap();
const SCOPE = new WeakMap();
const LOGGER = new WeakMap();
const MODALINSTANCE = new WeakMap();

class ChooseCalendarFolderController {
  constructor($modalInstance, $uibModal, $q, $rootScope, $scope, logger, mailService) {
    UIBMODAL.set(this, $uibModal);
    Q.set(this, $q);
    ROOTSCOPE.set(this, $rootScope);
    SCOPE.set(this, $scope);
    LOGGER.set(this, logger);
    MODALINSTANCE.set(this, $modalInstance);

    this.mailService = mailService;

    this.calendarItemsInHierachy = {};
    this.selectedFolderId = '';

    this._activate();
  }

  _activate() {
    //LOGGER.get(this).info('activated');
    let calendarString = localStorage.getItem('CALENDAR_TREE_VIEW');
    if (calendarString && calendarString !== '') {
      this.calendarItemsInHierachy = angular.copy(JSON.parse(calendarString));
      this.clearAllSelection(this.calendarItemsInHierachy);
    }
  }

  cancel() {
    MODALINSTANCE.get(this).dismiss('cancel');
  }

  clearAllSelection(calendarItemsInHierachy, currentSelectedItem) {
    for(let calendarItem of calendarItemsInHierachy) {
      if (currentSelectedItem && calendarItem.id === currentSelectedItem.id) {
        calendarItem.isSelected = true;
        this.selectedFolderId = currentSelectedItem.id;
      } else {
        calendarItem.isSelected = false;
      }

      if (calendarItem.childList && calendarItem.childList.length > 0) {
        this.clearAllSelection(calendarItem.childList, currentSelectedItem);
      }
    }
  }

  newFolder() {
    // TODO: Create new Folder on the Choose Folder Modal
  }

  ok() {
    ROOTSCOPE.get(this).$broadcast('CHOOSE_FOLDER_MODAL_CLOSED', this.selectedFolderId);
    MODALINSTANCE.get(this).close();
  }

  onCalendarSelectedItemChange(selectedCalendarNode) {
    this.clearAllSelection(this.calendarItemsInHierachy, selectedCalendarNode);
  }
}

export default ChooseCalendarFolderController;
