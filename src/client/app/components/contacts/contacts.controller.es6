class ContactsController {
  /* @ngInject */
  constructor(logger) {
    this.logger = logger;
    this.title = 'Contacts';
    this.activate();
  }

  activate(){
    // this.logger.info('Activated Contacts View');
  }
}

export default ContactsController;
