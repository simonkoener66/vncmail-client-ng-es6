import controller from './contextMenu.controller';
import './_contextMenu.scss';

let contextMenuComponent = ($parse) => {
  let renderContextMenu = (scope, element, event, options) => {
    let $;

    if (!$) {
      $ = angular.element;
    }

    let $body = $('body');

    let contextMenuHtmlString = '<div id="contextMenu" class="context-menu"><context-menu-detail></context-menu-detail></div>';

    scope.contextMenuType = options.contextMenuType;
    scope.contextMenuContactId = options.contextMenuContactId;
    scope.contextMenuConversation = options.contextMenuConversation;
    scope.contextMenuMailD = options.contextMenuMailD;
    scope.contextMenuMailIndex = options.contextMenuMailIndex;
    scope.contextMenuContactTags = options.contextMenuContactTags;
    scope.contextMenuAppointmentDetail = options.contextMenuAppointmentDetail;
    scope.tagId = options.tagId;
    scope.tagName = options.tagName;

    scope.contextMenuPosition = {
      'left': event.clientX + 'px',
      'top': event.clientY + 'px'
    };

    $body.append(options.compile(contextMenuHtmlString)(scope));

    let $contextMenu = $('#contextMenu');

    $contextMenu.bind('mousedown', (event) => {
      event.stopPropagation();

      if (event.target.id === 'contextMenu') {
        removeContextMenu();
      }
    });

  };

  let removeContextMenu = () => {
    let $;

    if (!$) {
      $ = angular.element;
    }

    let $contextMenu = $('#contextMenu');

    // Remove existed context menu
    if ($contextMenu.length > 0) {
      $contextMenu.remove();
    }
  };

  let link = (scope, element, attr, options) => {
    element.bind('contextmenu', (event) => {
      event.stopPropagation();

      // Trigger auto active click event on selected item
      angular.element(element).trigger('click');

      scope.$apply(function () {
        event.preventDefault();
        if (angular.isDefined(options.contextMenuType) && options.contextMenuType !== '') {
          removeContextMenu();
          renderContextMenu(scope, element, event, options);
        }
      });
    });
  };

  return {
    restrict: 'A',
    scope: {
      contextMenuType: '@',
      contextMenuContactId: '@',
      contextMenuConversation: '=',
      contextMenuMailIndex: '=',
      contextMenuMailD: '=',
      contextMenuContactTags: '@',
      contextMenuAppointmentDetail: '=',
      tagId: '@',
      tagName: '@'
    },
    link,
    controller,
    controllerAs: 'vm',
    bindToController: true
  };
};

contextMenuComponent.$inject = ['$parse'];

export default contextMenuComponent;
