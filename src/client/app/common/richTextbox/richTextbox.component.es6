import template from './richTextbox.html';
import controller from './richTextbox.controller';

//Usage:
//<vnc-rich-textbox textarea-required="true" textarea-options="{}" ng-model="vm.content"></vnc-rich-textbox>
/*
 default textarea-required = true;
 default textarea-options = {};
 default ng-model = content;
 */

let richTextboxComponent = () => {
    return {
        restrict: 'EA',
        scope: {
            value: '=ngModel',
            textareaRequired: '@textareaRequired',
            textareaOptions: '@textareaOptions',
            blur: '&'
        },
        require: 'ngModel',
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true,
        link: function(scope, element){
          element.on('blur', 'textarea', function (event) {
            scope.vm.blur(); //calling controller method.
          });
        }
    };
};

export default richTextboxComponent;
