class TagController {
    constructor( vncConstant ) {

      let vm = this;
      vm.name = vm.name || 'tag';
      vm.tagClass = vm.color ? vncConstant.COLOR_CODES[vm.color].toLowerCase() : '';

    }
}

export default TagController;
