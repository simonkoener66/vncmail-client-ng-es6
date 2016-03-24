import controller from './datePopup.controller';
import template from './datePopup.html';
import './_datePopup.scss';

let datePopupComponent = ($parse, $compile) => {

  let link = (scope, element, attr, options) => {
    element.bind('mouseover', (event) => {
      event.stopPropagation();
      scope.popupPosition = {
        'left': event.pageX + 'px',
        'top': event.pageY + 'px'
      };
      var $contact = angular.element(element);
      if ( $contact.hasClass('open-popup') ) {
      }
      else {
        $contact.addClass('open-popup');
        $contact.append('<div id="datePopup" style="left:' + scope.popupPosition.left +'" />' );
        var $datePopup = angular.element(document.querySelectorAll('#datePopup')[0]);
        let content = $compile(template)(scope);
        $datePopup.html(content);

      }
      // Trigger auto active click event on selected item
      angular.element(element).trigger('click');

      scope.$apply(function () {
        event.preventDefault();

      });
    });

    element.bind('mouseleave', (event) => {
      event.stopPropagation();
      var $contact = angular.element(element);
      $contact.removeClass('open-popup');
      angular.element('#datePopup').remove();
      // Trigger auto active click event on selected item
      angular.element(element).trigger('click');

      scope.$apply(function () {
        event.preventDefault();

      });
    });

  };

  return {
    restrict: 'A',
    scope: {
      date: '@'
    },
    link,
    controller,
    controllerAs: 'vm',
    bindToController: true
  };
};

datePopupComponent.$inject = ['$parse', '$compile'];

export default datePopupComponent;
