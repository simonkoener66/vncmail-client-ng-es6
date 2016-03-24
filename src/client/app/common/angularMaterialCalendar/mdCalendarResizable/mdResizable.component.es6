import controller from './mdResizable.controller';

let mdResizableComponent = function () {
  return {
    restrict: 'A',
    controller
  };
};

export default mdResizableComponent;
