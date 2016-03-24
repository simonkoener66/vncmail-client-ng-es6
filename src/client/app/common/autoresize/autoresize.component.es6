let autoresizeComponent = () => {
    //Usage: add to element     vnc-auto-resize

    return {
        restrict: 'A',
        link: function(scope, element, attribute){
            element.on('keyup', function() {
                element.css('height', 0, 'overflow', 'hidden');
                element.css('height', element[0].scrollHeight+'px');
            });
        }
    };


};

autoresizeComponent.$inject = [];
/* @ngInject */

export default autoresizeComponent;
