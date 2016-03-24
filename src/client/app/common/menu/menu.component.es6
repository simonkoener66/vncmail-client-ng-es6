//Usage:
//<vnc-menu items="folderMenu.items" size="folderMenu.size"><i class="fa fa-ellipsis-h"></i></vnc-menu>
/*
 require items = '[]' by scope;
 require size = 'sm md lg' by scope;
 */

import controller from './menu.controller';

let menuComponent = () => {

  let renderMenuContent = (scope, element, event, options) => {
    let $;
    if (!$) {
      $ = angular.element;
    }
    let $body = $('body');

    let contextMenuHtmlString = '<div id="menuContent" class="context-menu"><vnc-menu-content></vnc-menu-content></div>';
    scope.items = options.items;
    scope.size = options.size;
    scope.data = options.data;
    scope.menuContentPosition = {
      'left': (event.pageX - 15) + 'px',
      'top': (event.pageY + 15) + 'px'
    };

    $body.append(options.compile(contextMenuHtmlString)(scope));

    let $contextMenu = $('#menuContent');

    $contextMenu.bind('mousedown', (event) => {
      event.stopPropagation();
      if(event.target.id === 'menuContent'){
        removeMenuContent();
      }
    });
  };

  let removeMenuContent = () => {
    let $;
    if (!$) {
      $ = angular.element;
    }
    let $contextMenu = $('#menuContent');

    // Remove existed context menu component
    if ($contextMenu.length > 0) {
      $contextMenu.remove();
    }
  };

  let link = (scope, element, attr, options) => {
    element.bind('click', (event) => {
      event.stopPropagation();

      scope.$apply(function () {
        event.preventDefault();
        removeMenuContent();
        renderMenuContent(scope, element, event, options);
      });
    });
  };

  return {
    restrict: 'EA',
    scope: {
      items: '=',
      size: '=',
      data: '='
    },
    link,
    controller,
    controllerAs: 'vm',
    bindToController: true
  };
};


export default menuComponent;
