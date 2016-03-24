class FileRepeatController {
    /* @ngInject */
    constructor( logger ) {
        let vm = this;
        vm.files = vm.files || [];

        // remove upload file
        vm.removeFile = (index, file) => {
            vm.files.splice(index, 1);
            // logger.info(file.name + ' removed');
        };

    }

}

export default FileRepeatController;
