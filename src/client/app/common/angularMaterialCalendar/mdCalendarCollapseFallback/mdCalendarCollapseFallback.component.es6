import controller from './mdCalendarCollapseFallback.controller';

let mdCalendarCollapseFallbackComponent = function () {
  if ($injector.has('uibCollapseDirective')) {
    return {};
  }

  return {
    restrict: 'A',
    controller
  };
};

export default mdCalendarCollapseFallbackComponent;
