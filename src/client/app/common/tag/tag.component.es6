import template from './tag.html';
import controller from './tag.controller';

//Usage:
//<vnc-tag></vnc-tag>
//<vnc-tag tag-name="{{name}}"></vnc-tag>
//<vnc-tag tag-color="{{color}}"></vnc-tag>
//<vnc-tag tag-rgb="{{rgb-color}}"></vnc-tag>
//<vnc-tag tag-name="{{name}}" tag-color="{{color}}" tag-rgb="{{rgb-color}}"></vnc-tag>
/*
 default tagName = 'tag';
 default tagColor = 'orange';
 */

let tagComponent = () => {
    return {
        restrict: 'EA',
        scope: {
            color: '@tagColor',
            tagId: '@tagId',
            name: '@tagName',
            rgb: '@tagRgb',
          tagContextMenuDisabled: '@'
        },
        template,
        controller,
        controllerAs: 'vm',
        bindToController: true
    };
};

export default tagComponent;
