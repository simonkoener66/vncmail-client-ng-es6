class MenuContentController {
  /* @ngInject */
  constructor( $sce, $scope ) {

    let vm = this;
    vm.$sce = $sce;
    vm.menuContentPosition = $scope.menuContentPosition;
    vm.items = $scope.items;
    vm.size = $scope.size;
    vm.data = $scope.data;
    vm.$ = angular.element;

    let onMenuItemRepeatPostback = $scope.$on('menuItemRepeatFinished', (event) => {
      event.stopPropagation();

      let $contextMenu = vm.$('.menu-item-parent'),
        contextMenuHeight = $contextMenu.prop('clientHeight'),
        contextMenuWidth = $contextMenu.prop('clientWidth'),
        bodyHeight = vm.$('body').prop('clientHeight'),
        bodyWidth = vm.$('body').prop('clientWidth'),
        offsetTop = parseInt(vm.menuContentPosition.top),
        offsetLeft = parseInt(vm.menuContentPosition.left),
        newOffsetTop = offsetTop,
        newOffsetLeft = offsetLeft;

      if (offsetTop + contextMenuHeight > bodyHeight) {
        newOffsetTop = bodyHeight - contextMenuHeight - 10;
      }

      if (offsetLeft + contextMenuWidth > bodyWidth) {
        newOffsetLeft = bodyWidth - contextMenuWidth - 10;
      }

      this.menuContentPosition.top = newOffsetTop + 'px';
      this.menuContentPosition.left = newOffsetLeft + 'px';

      // destroy event
      onMenuItemRepeatPostback();
    });
  }

  sanitizeHtml(item){
    return this.$sce.trustAsHtml(item);
  }

  hideMenu(){
    let $;
    if (!$) {
      $ = angular.element;
    }
    let $contextMenu = $('#menuContent');

    // Remove existed context menu component
    if ($contextMenu.length > 0) {
      $contextMenu.remove();
    }
  }

  applySize(){
    let temp = '';
    this.show && (temp += 'active ');
    switch(this.size){
      case'sm':
        temp += 'menu-sm';
        return temp;
        break;
      case'md':
        temp += 'menu-md';
        return temp;
        break;
      case'lg':
        temp += 'menu-lg';
        return temp;
        break;
      default:
        temp += 'menu-md';
        return temp;
        break;
    }
  }
}

export default MenuContentController;


