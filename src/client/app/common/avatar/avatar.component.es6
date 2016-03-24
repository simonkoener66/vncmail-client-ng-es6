import template from './avatar.html';
import controller from './avatar.controller';

let avatarComponent = function () {
    //Usage:
    //<vnc-avatar person-email="email" person-name="HH" person-size="sm"></vnc-avatar>
    //<vnc-avatar person-name="HH" person-size="sm"></vnc-avatar>
    /*
     person-image: image path
     person-name: person name
     person-size: xs, sm, md, lg
     */

    return {
        restrict: 'EA',
        scope: {
            name: '@personName',
            email: '=personEmail',
            image: '=personImage',
            contact: '=contact',
            size: '@personSize'
        },
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };


};

export default avatarComponent;
