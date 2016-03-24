import template from './card.html';
require('angular-mocks/angular-mocks');

//Usage:
//<vnc-card image="../images/washedout.png" title="my second card" description="what you want to write">
//    <card-action>             //Optional
//        <button>submit</button>
//        <button>cancel</button>
//    </card-action>
//</vnc-card>

/*
 image: image url
 title: title text
 description: description text
*/

/* @ngInject */
let cardComponent = () => {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
        image: '@',
        title: '@',
        description: '@'
    },
    template,
    controller: () => {},
    controllerAs: 'vm',
    bindToController: true
  };
};

export default cardComponent;
