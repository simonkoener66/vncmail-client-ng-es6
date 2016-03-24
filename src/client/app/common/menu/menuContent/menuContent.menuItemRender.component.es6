let menuItemRenderComponent = ($timeout) => {
  let link = (scope, element, attr) => {
    if (scope.$last) {
      $timeout(function () {
        scope.$emit('menuItemRepeatFinished');
      });
    }
  };

  return {
    restrict: 'A',
    scope: false,
    link
  };
};

menuItemRenderComponent.$inject = ['$timeout'];

export default menuItemRenderComponent;
