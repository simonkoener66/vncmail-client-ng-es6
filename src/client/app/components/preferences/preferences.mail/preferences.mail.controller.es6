class preferencesMailController {
  /* @ngInject */
  constructor( ) {
    var vm = this;
    vm.allowedDomains = [];
    vm.blockedDomains = [];
  }

  setAllowedIndex(index){
    this.aIndex = index;
  }

  setBlockedIndex(index){
    this.bIndex = index;
  }

  addAllowedDomain(){
    this.allowedDomains.unshift(this.newAllowedDomain);
    this.newAllowedDomain = '';
  }

  removeAllowedDomain(){
    this.allowedDomains.splice(this.aIndex, 1);
  }

  addBlockedDomain(){
    this.blockedDomains.unshift(this.newBlockedDomain);
    this.newBlockedDomain = '';
  }

  removeBlockedDomain(){
    this.blockedDomains.splice(this.bIndex, 1);
  }
}

export default preferencesMailController;
