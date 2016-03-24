import ContactDistributionListDetailModule from './contacts.distribution.list.detail'
import ContactDistributionListDetailController from './contacts.distribution.list.detail.controller';
import ContactDistributionListDetailComponent from './contacts.distribution.list.detail.component';
import ContactDistributionListDetailTemplate from './contacts.distribution.list.detail.html';
import ContactModule from '../../contacts.es6';
import CoreModule from '../../../../common/core/core';


describe('Contact Distribution List Detail', () => {
  let $stateParams, makeController, routerHelper, module;

  beforeEach(window.module( ContactDistributionListDetailModule.name, ContactModule.name, CoreModule.name));
  beforeEach(inject(( _routerHelper_) => {
    $stateParams = {contactId: 8712};
    routerHelper = _routerHelper_;
    makeController = () => {
      return new ContactDistributionListDetailController( $stateParams );
    };
  }));

  describe('Module', () => {
    //top-level specs: i.e., routes, injection, naming
    before(function() {
      module = angular.module("contacts.distribution.list.detail");
    });

    it("Contact Distribution List Detail module should be registered", function() {
      expect(module).to.not.equal(null);
    });

    it("Contact Distribution List Detail module should be equal to ContactDistributionListDetailModule", function() {
      expect(module).to.be.equal(ContactDistributionListDetailModule);
    });
  });

  describe('Controller', () => {

    // controller specs
    it('Ctrl should be defined', () => {
      let controller = makeController();
      expect(controller).to.be.defined;
    });

    it('isSelectedContactId to be true', () => {
      let controller = makeController();
      expect(controller.isSelectedContactId).to.be.true;
    });

    it('selectedContactId to be equal to $stateParams.contactId', () => {
      let controller = makeController();
      expect(controller.selectedContactId).to.be.equal($stateParams.contactId);
    });

  });

  describe('Component', () => {
    // component/directive specs
    let component = ContactDistributionListDetailComponent();

    it('includes the intended template',() => {
      expect(component.template).to.equal(ContactDistributionListDetailTemplate);
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(ContactDistributionListDetailController);
    });

    it('uses `controllerAs` syntax and equal to vm', () => {
      expect(component).to.have.property('controllerAs', 'vm');
    });

    it('uses `bindToController` syntax and equal to true', () => {
      expect(component).to.have.property('bindToController', true);
    });

    it('uses restrict and equal to E', () => {
      expect(component).to.have.property('restrict', 'E');
    });

  });

});
