//Usage:
//<vnc-resize-header height-space="110"></vnc-resize-header>
/*
 default height-space = 20 How many space minus from height By value {optional};
 */


let resizeHeaderComponent = ( $window ) => {
  /* @ngInject */
  return {
    restrict: 'EA',
    scope: {
        heightSpace: '@'
    },
    link:function(scope, element, attrs){
      var space = attrs.heightSpace || 0;
      angular.element(document).ready(function () {
        element.css('height', ($window.innerHeight - space)+ 'px');
      });

      angular.element(window).on('resize', function(){
        element.css('height', ($window.innerHeight - space)+ 'px');
      });
    }
  };
};

resizeHeaderComponent.$inject = ['$window'];

export default resizeHeaderComponent;
