class CreateNewTagController {
  /* @ngInject */
  constructor($mdDialog, logger, tagService) {
    let vm = this;
    vm.cancel = () => {
      $mdDialog.cancel();
    };
    vm.reqPending = false;
    vm.availableColors = ['Blue', 'Cyan', 'Green', 'Purple', 'Red', 'Yellow', 'Pink'];
    vm.rgbCodes = {
      'Blue': '#42a5f6',
      'Cyan': '#00BCD4',
      'Green': '#66bb6a',
      'Purple': '#5B69C3',
      'Red': '#F1524A',
      'Yellow': '#ef6c00',
      'Pink': '#E91E63'
    };

    vm.addNewTag = () => {
      vm.reqPending = true;
      let tag = {
        "tagName": vm.tagName
      };
      vm.moreColor && (tag.rgb = vm.selectColor);
      vm.moreColor || (tag.rgb = vm.rgbCodes[vm.selectColor]);
      tagService.createNewTag(tag, (res, err) => {
        if (err) {
          vm.reqPending = false;
          let duplicateError = 'object with that name already exists';
          if(err.msg  && err.msg.toLowerCase().indexOf(duplicateError) > -1){
            logger.error('A tag with that name exists. Please use another name. (Tag names are case-insensitive.)');
          }
          else{
            logger.error(err.msg);
          }
        }
        else {
          // logger.info('Tag "' + vm.tagName + '" was added successfully.');
          vm.reqPending = false;
          // Close modal and passing value to target.
          $mdDialog.hide(res);
        }
      });
    };
  };
}

let newTagControllerInstance = /*@ngInject*/ ($mdDialog, logger, tagService) => new CreateNewTagController($mdDialog, logger, tagService);
export default newTagControllerInstance;
