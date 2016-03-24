let mdCalendarIncludeReplaceTemplateComponent = function () {
  return {
    restrict: 'A',
    require: 'ngInclude',
    link: function (scope, element, attrs) {
      element.replaceWith(element.children());
    }
  };
};

export default mdCalendarIncludeReplaceTemplateComponent;
