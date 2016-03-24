class RichTextboxController {
    constructor() {
        let vm = this;
        vm.textareaOptions = vm.textareaOptions || {};
        vm.value = 'Message...';
        let options = {
            selector: "textarea",
            plugins: [
                "autoresize advlist autolink autosave link image lists charmap print hr anchor",
                "wordcount visualblocks visualchars code nonbreaking",
                "table contextmenu emoticons textcolor textcolor colorpicker textpattern"
            ],

            toolbar1: "bold italic underline bullist",
            //toolbar1: "bold italic underline strikethrough | formatselect fontselect fontsizeselect | forecolor backcolor",
            //toolbar2: "bullist numlist | alignleft aligncenter alignright alignjustify | outdent indent blockquote | undo redo | link unlink anchor image code",
            //toolbar3: "table | hr removeformat | subscript superscript | charmap emoticons",

            menubar: false,
            statusbar: false,
            toolbar_items_size: 'small',
            theme: "modern"
        };
        vm.options = angular.extend(options, vm.textareaOptions);
    }
}

export default RichTextboxController;
