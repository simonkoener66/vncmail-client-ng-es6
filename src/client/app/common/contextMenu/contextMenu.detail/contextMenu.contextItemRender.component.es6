let contextItemRenderComponent = ($timeout) => {
  let link = (scope, element, attr) => {
    if (scope.$last) {
      $timeout(function () {
        scope.$emit('contextItemRepeatFinished');
      });
    }
  };

  return {
    restrict: 'A',
    scope: false,
    link
  };
};

contextItemRenderComponent.$inject = ['$timeout'];

export default contextItemRenderComponent;
