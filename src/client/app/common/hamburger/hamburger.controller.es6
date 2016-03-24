class HamburgerController {
    /* @ngInject */
    constructor() {
        let vm = this;
    }

    toggleState() {
      let vm = this;
      return vm.state = !vm.state;
    }
}

export default HamburgerController;
