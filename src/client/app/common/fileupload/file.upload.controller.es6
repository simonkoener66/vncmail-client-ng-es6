class FileUploadController {
    /* @ngInject */
    constructor( mailService, logger ) {
        let vm = this;
        vm.files = vm.files || [];
        vm.multiple = vm.multiple || true;
        vm.draft = vm.draft || function(){};

        // upload files to server
        vm.uploadFiles = (files, errFiles) => {
          vm.errFile = errFiles && errFiles[0];
          files && angular.forEach(files, function(f) {
                mailService.upload(f, function(res, err){
                  if(res){
                      let uploadedFiles = JSON.parse(res);
                      vm.files.push({
                          aid: uploadedFiles[0].aid,
                          name: uploadedFiles[0].filename,
                          size: uploadedFiles[0].s
                      });
                      vm.draft();
                      // logger.success('Successfully upload');
                  }
                  else{
                      logger.error('uploading failed');
                  }
                })
            });
        };

    }

}

export default FileUploadController;
