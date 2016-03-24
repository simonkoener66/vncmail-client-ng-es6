class preferencesSharingController {
  /* @ngInject */
  constructor(  $rootScope, $scope, $uibModal, auth, logger, mailService, vncConstant ) {
    var vm = this;
    vm.data = [
      {
        owner: 'zimbra-manager@vnc.biz',
        item: '/Holidays DE',
        type: 'Calender',
        role: 'Viewer',
        actions: 'Accept',
        with: 'vnc.team@vnc.biz'
      },
      {
        owner: 'zimbra-manager@vnc.biz',
        item: '/Holidays PK',
        type: 'Calender',
        role: 'Viewer',
        actions: 'Accept',
        with: 'vnc.team@vnc.biz'
      },
      {
        owner: 'zimbra-manager@vnc.biz',
        item: '/Holidays IN',
        type: 'Calender',
        role: 'Viewer',
        actions: 'Accept',
        with: 'vnc.team@vnc.biz'
      }
    ]
  }
}

export default preferencesSharingController;
