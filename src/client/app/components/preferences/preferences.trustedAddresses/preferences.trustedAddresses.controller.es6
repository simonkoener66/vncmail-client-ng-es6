class preferencesTrustedAddressesController {
  /* @ngInject */
  constructor( ) {

    // data initialization
    var vm = this;
    vm.domains = [];

  }

  setIndex(index){
    this.index = index;
  }

  addDomain(){
    this.domains.unshift(this.newDomain);
    this.newDomain = '';
  }

  removeDomain(){
    this.domains.splice(this.index, 1);
  }
}

export default preferencesTrustedAddressesController;
