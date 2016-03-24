class ContactDeleteController {
	/* @ngInject */
	constructor(logger, $modalInstance,$stateParams,$state,mailService) {

        this.defaultTagColors = [
            {name: 'Blue', code: '0000FF'},
            {name:'Cyan', code: '00FFFF'},
            {name:'Green', code: '008000'},
            {name:'Purple', code: '800080'},
            {name:'Red', code: 'FF0000'},
            {name:'Yellow', code: 'FFFF00'},
            {name:'Pink', code: 'FFC0CB'},
            {name:'Custom', code: ''}
        ];

		function activate() {
			// logger.info('Contact Delete View Activated');
		 };
	}
}
export default ContactDeleteController;
