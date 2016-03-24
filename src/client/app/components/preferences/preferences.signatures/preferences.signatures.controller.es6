class preferencesSignaturesController {
  /* @ngInject */
  constructor( ) {
    var vm = this;
    vm.signatures = ['enter Name'];
    vm.availableSignatures = ['No Signature']
  }

  setIndex(index){
    this.index = index;
  };

  addSignature(){
    this.signatures.unshift(this.newSignature);
    this.availableSignatures.unshift(this.newSignature);
    this.newSignature = '';
  };

  removeSignature(){
    this.signatures.splice(this.index, 1);
    this.availableSignatures.splice(this.index, 1);
  };
}

export default preferencesSignaturesController;
