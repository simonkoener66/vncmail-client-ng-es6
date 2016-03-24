const MD_DIALOG = new WeakMap();

class CalendarModalController {
    /* @ngInject */
  constructor($mdDialog, mailService, sidebarCalendarFolderService,hotkeys) {

    let vm = this;
    MD_DIALOG.set(vm, $mdDialog);
    vm.mailService = mailService;
    vm.sidebarCalendarFolderService = sidebarCalendarFolderService;

    vm.selectedColorId = 1;

    vm.availableColors = [{
      id: 1,
      name: 'Blue',
      class: 'blue'
    }, {
      id: 2,
      name: 'Cyan',
      class: 'cyan'
    }, {
      id: 3,
      name: 'Green',
      class: 'green'
    }, {
      id: 4,
      name: 'Purple',
      class: 'purple'
    }, {
      id: 5,
      name: 'Red',
      class: 'red'
    }, {
      id: 6,
      name: 'Yellow',
      class: 'yellow'
    }, {
      id: 7,
      name: 'Pink',
      class: 'pink'
    }, {
      id: 8,
      name: 'Gray',
      class: 'gray'
    }, {
      id: 9,
      name: 'Orange',
      class: 'orange'
    }];

    vm.rgbCodes = {
      'Blue': '#42a5f6',
      'Cyan': '#00BCD4',
      'Green': '#66bb6a',
      'Purple': '#5B69C3',
      'Red': '#F1524A',
      'Yellow': '#ef6c00',
      'Pink': '#E91E63'
    };

    /*hotkeys added */
    hotkeys.add({
      combo: ['enter','space'],
      callback: function(event) {
        event.preventDefault();
        if(angular.isDefined(vm.calendarName) && vm.calendarName != ''){
          vm.ok();
        }
      }
    });

    hotkeys.add({
      combo: ['ctrl+s'],
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function(event) {
        event.preventDefault();
        if(angular.isDefined(vm.calendarName) && vm.calendarName != ''){
          vm.ok();
        }
      }
    });

    hotkeys.add({
      combo: ['esc'],
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function(event) {
          vm.cancel();
      }
    });

    hotkeys.add({
      combo: ['ctrl+x'],
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function(event) {
        event.preventDefault();
        $('body').attr("spellcheck",true);
      }
    });
    
  }

  setCalendarColor(color) {
    let vm = this;
    vm.selectedColorId = color.id;
  }

  dismissColorPicker() {
    let vm = this;
    if (vm.isCustomColor) {
      vm.isCustomColor = !vm.isCustomColor;
    }
  }

  ok() {
    let vm = this;
    let calendar = {
      name: vm.calendarName,
      folderId: vm.sidebarCalendarFolderService.SelectedCalendarFolder.$.id || 1,
      f: vm.isFreeBusyExcluded ? 'b#' : '#',
      color: vm.selectedColorId
    };

    vm.mailService.createCalendarFolder(calendar, (res) => {
      if (res.folder) {
        // Success - Close modal and passing value to target.
        MD_DIALOG.get(vm).hide({
          success: true,
          result: res.folder
        });
      } else {
        // Error
        MD_DIALOG.get(vm).hide({
          success: false,
          error: res
        });
      }
    });
  }

  cancel() {
    let vm = this;
    MD_DIALOG.get(vm).cancel();
  }

  /* @ngInject */
  static instance($mdDialog, mailService, sidebarCalendarFolderService,hotkeys) {
    return new CalendarModalController($mdDialog, mailService, sidebarCalendarFolderService,hotkeys);
  }
}

export default CalendarModalController.instance;

CalendarModalController.$inject = ['$mdDialog',  'mailService','sidebarCalendarFolderService','hotkeys']
