class MenuContentController {
  /* @ngInject */
  constructor( $scope ) {

    let vm = this;
    vm.mail = $scope.mail;
    vm.menuContentPosition = $scope.menuContentPosition;
    let removeContactDetailContent = () => {
      let $contextMenu = angular.element('#contactDetail');

      // Remove existed context menu component
      if ($contextMenu.length > 0) {
        $contextMenu.remove();
      }
    };

    vm.mouseLeave = function(event){
      event.stopPropagation();
      if(event.relatedTarget && event.relatedTarget.className.search('contact') < 0){
        removeContactDetailContent();
      }
    }
  }

}

export default MenuContentController;


