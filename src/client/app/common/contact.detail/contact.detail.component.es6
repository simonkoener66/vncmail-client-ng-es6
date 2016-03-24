import controller from './contact.detail.controller';

let ContactDetailComponent = function () {

  let renderContactDetailContent = (scope, element, event, options) => {
    let $;
    if (!$) {
      $ = angular.element;
    }
    let $body = $('body');

    let contactDetailHtmlString = '<vnc-contact-detail-content></vnc-contact-detail-content>';
    scope.mail = options.mail;
    scope.menuContentPosition = {
      'left': (event.pageX - 15) + 'px',
      'top': (event.pageY + 5) + 'px'
    };

    $body.append(options.compile(contactDetailHtmlString)(scope));

  };

  let removeContactDetailContent = () => {
    let $;
    if (!$) {
      $ = angular.element;
    }
    let $contextMenu = $('#contactDetail');

    // Remove existed context menu component
    if ($contextMenu.length > 0) {
      $contextMenu.remove();
    }
  };

  let link = (scope, element, attr, options) => {
    element.bind('mouseenter', function(event) {
      event.stopPropagation();

      scope.$apply(function () {
        event.preventDefault();
        removeContactDetailContent();
        renderContactDetailContent(scope, element, event, options);
      });
    });

    element.on('mouseleave', function(event) {
      event.stopPropagation();

      scope.$apply(function () {
        event.preventDefault();
        if(event.relatedTarget && event.relatedTarget.id != 'contactDetail'){
          removeContactDetailContent();
        }
      });
    });

  };

  return {
    restrict: 'EA',
    scope: {
      mail: '='
    },
    link,
    controller,
    controllerAs: 'vm',
    bindToController: true
  };
};

export default ContactDetailComponent;
