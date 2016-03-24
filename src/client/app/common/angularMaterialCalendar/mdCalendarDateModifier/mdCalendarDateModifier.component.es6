import controller from './mdCalendarDateModifier.controller';

let mdCalendarDateModifierComponent = function () {
  return {
    restrict: 'A',
    controller,
    scope: {
      date: '=',
      increment: '=',
      decrement: '='
    },
    controllerAs: 'vm',
    bindToController: true
  };
};

export default mdCalendarDateModifierComponent;
