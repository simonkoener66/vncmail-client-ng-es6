import template from './autocomplete.html';
import controller from './autocomplete.controller';

let autocompleteComponent = function () {
  //Usage:
  //<vnc-auto-complete-mail mail-array="vm.tp" placeholder="TO"></vnc-auto-complete-mail>
  //tags: '=mailArray'        required
  //placeholder '@'          required

  return {
    restrict: 'EA',
    template,
    controller,
    scope: {
      tags: '=mailArray',
      placeholder: '@',
      blur: '&'
    },
    controllerAs: 'vm',
    bindToController: true,
    link: function(scope, element){
      // element.find('input').bind('blur', function (event) {
      //   scope.vm.blur(); //calling controller method.
      // });
    }
  };


};

export default autocompleteComponent;
