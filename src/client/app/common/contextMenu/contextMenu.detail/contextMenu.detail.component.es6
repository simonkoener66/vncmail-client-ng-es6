import template from './contextMenu.detail.html';
import controller from './contextMenu.detail.controller';
import './_contextMenu.detail.scss';

let contextMenuDetailComponent = () => {
  let link = (scope, element, attr) => {
    // Prevent right click on context menu
    element.bind('contextmenu', function (event) {
      scope.$apply(function () {
        event.preventDefault();
      });
    });
  };

  return {
    restrict: 'E',
    scope: false,
    template,
    link,
    controller,
    controllerAs: 'vm',
    bindToController: true
  };
};

export default contextMenuDetailComponent;
