import template from './editor.html';
import controller from './editor.controller';

/* @ngInject */
let editorComponent = ($sce) => {
  function link(scope, element, attrs, ngModel) {
    element.on('trix-initialize', function() {
        if (ngModel.$modelValue) {
            element.find('trix-editor')[0].editor.loadHTML(ngModel.$modelValue);
        }
    });

    // scope.$watch(function () {
    //     return ngModel.$modelValue;
    //  }, function(newValue) {
    //     element.find('trix-editor')[0].editor.loadHTML(newValue);
    //  });



    ngModel.$render = function() {
      console.log(ngModel.$modelValue);
        if (element.find('trix-editor')) {
          console.log(ngModel.$modelValue);
            element.find('trix-editor')[0].editor.loadHTML(ngModel.$modelValue);
        }

        element.on('trix-change', function() {
            ngModel.$setViewValue( element.find('trix-editor').html() );
        });

    };

  }

  return {
    restrict: 'EA',
    transclude: true,
    replace: false,
    require: 'ngModel',
    scope: {
              placeholder: '@'
              // ngModel: '='
    },
    template,
    link: link,
    controller,
    controllerAs: 'vm',
    bindToController: true
  };
};

export default editorComponent;
