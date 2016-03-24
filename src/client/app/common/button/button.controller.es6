class ButtonController {
    /* @ngInject */
    constructor() {

        let vm = this;

        vm.isAnchor = ( attr ) => {
            return angular.isDefined(attr.href) || angular.isDefined(attr.ngHref) || angular.isDefined(attr.ngLink) || angular.isDefined(attr.uiSref);
        };

    }

    applySize() {
        switch (this.size) {
            case'sm':
                return 'button-sm';
                break;
            case'md':
                return 'button-md';
                break;
            case'lg':
                return 'button-lg';
                break;
            default:
                return 'button-md';
                break;
        }
    };
}

export default ButtonController;
