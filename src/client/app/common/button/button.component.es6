import template from './button.html';
import controller from './button.controller';

//Usage:
//<vnc-button button-size="sm">Submit</vnc-button>
//<vnc-button> Flat Button </vnc-button>
//<vnc-button href="http://google.com"> Flat link </vnc-button>
//<vnc-button class="vnc-raised"> Raised Button </vnc-button>
//<vnc-button class="vnc-raised vnc-primary"> Raised Button primary </vnc-button>
//<vnc-button ng-disabled="true"> Disabled Button </vnc-button>
/*
 Button classes: vnc-raised, vnc-fab, vnc-sm-fab, vnc-flat, vnc-icon-button, //required classes
                 vnc-primary, vnc-success, vnc-warning, vnc-disabled                      //optional classes
*/
/*
 button-size: sm, md, lg
*/

/* @ngInject */
let buttonComponent = ( $timeout ) => {

    function isAnchor(attr) {
        return angular.isDefined(attr.href) || angular.isDefined(attr.ngHref) || angular.isDefined(attr.ngLink) || angular.isDefined(attr.uiSref);
    }

    function getTemplate(element, attr) {
        return isAnchor(attr) ?
           '<a class="vnc-button link" ng-transclude ng-class="vm.applySize()"></a>':
           template;
    }

    function link(scope, element, attr) {
        if (isAnchor(attr)) {
            scope.isAnchor = true;
        }
        // For anchor elements, we have to set tabindex manually when the
        // element is disabled

        if (isAnchor(attr) && angular.isDefined(attr.ngDisabled) ) {
            scope.$watch(attr.ngDisabled, function(isDisabled) {
                element.attr('tabindex', isDisabled ? -1 : 0);
            });
        }

        // disabling click event when disabled is true
        element.on('click', function(e){
          if (attr.disabled === true) {
            e.preventDefault();
            e.stopImmediatePropagation();
          }
        });

        // restrict focus styles to the keyboard
        scope.mouseActive = false;
        element.on('mousedown', function() {
            scope.mouseActive = true;
            $timeout(() => scope.mouseActive = false, 100);
          })
          .on('focus', function() {
            if (scope.mouseActive === false) {
                element.addClass('vnc-focused');
            }
          })
          .on('blur', function(ev) {
            element.removeClass('vnc-focused');
          });

    }

    return {
        restrict: 'EA',
        transclude: true,
        replace: true,
        scope: {
            'size': '@buttonSize'
        },
        template: getTemplate,
        controller,
        link: link,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default buttonComponent;
