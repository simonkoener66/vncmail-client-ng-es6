import controller from './contactPopup.controller';
import template from './contactPopup.html';
import './_contactPopup.scss';

let contactPopupComponent = ($parse, $compile) => {

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
        $contact.append('<div id="contactPopup" style="left:' + scope.popupPosition.left +'" />' );
        var $contactPopup = angular.element(document.querySelectorAll('#contactPopup')[0]);
        let content = $compile(template)(scope);
        $contactPopup.html(content);

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
      console.info('mouseleave');
      $contact.removeClass('open-popup');
      angular.element('#contactPopup').remove();
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
      contact: '=',
      contactDetail: '=contactDetail',
    },
    link,
    controller,
    controllerAs: 'vm',
    bindToController: true
  };
};

contactPopupComponent.$inject = ['$parse', '$compile'];

export default contactPopupComponent;
