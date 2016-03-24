import ContactDetailModule from './contacts.contacts.detail'
import ContactDetailController from './contacts.contacts.detail.controller';
import ContactDetailComponent from './contacts.contacts.detail.component';
import ContactDetailTemplate from './contacts.contacts.detail.html';
import ContactModule from '../../contacts.es6';
import CoreModule from '../../../../common/core/core';
import MockData from '../../../../../test-helpers/mock-data';
import 'angular-filter/dist/angular-filter.js';


describe('Contacts Detail', () => {
  let $stateParams, makeController, $filter, routerHelper, module, contactDetailsService, $state;

  beforeEach(window.module( ContactDetailModule.name, ContactModule.name, CoreModule.name, 'angular.filter'));
  beforeEach(inject(( _contactDetailsService_, _$window_,_$state_, _routerHelper_,_$filter_) => {
    $stateParams = {contactId: 8712};
    contactDetailsService = _contactDetailsService_;
    $state = _$state_;
    routerHelper = _routerHelper_;
    $filter = _$filter_;
    makeController = () => {
      return new ContactDetailController( $stateParams, contactDetailsService, $state );
    };
  }));

  describe('Module', () => {
    //top-level specs: i.e., routes, injection, naming
    before(function() {
      module = angular.module("contacts.contacts.detail");
    });

    it("Contact Detail module should be registered", function() {
      expect(module).to.not.equal(null);
    });

    it("Contact Detail module should be equal to ContactDetailModule", function() {
      expect(module).to.be.equal(ContactDetailModule);
    });
  });

  describe('Controller', () => {

    // controller specs
    it('Ctrl should be defined', () => {
      let controller = makeController();
      expect(controller).to.be.defined;
    });

    it('contactsDetails to be an object', () => {
      let controller = makeController();
      expect(controller.contactsDetails).to.be.an('object');
    });

    it('addressType to be an object and check properties', () => {
      let controller = makeController();
      expect(controller.addressType).to.be.an('object').and.have.property('home', 'Home');
      expect(controller.addressType).to.have.property('work', 'Work');
      expect(controller.addressType).to.have.property('other', 'Other')
    });

    it('selectedContactId to be equal to $stateParams.contactId', () => {
      let controller = makeController();
      expect(controller.selectedContactId).to.be.equal($stateParams.contactId);
    });

    it('isSelectedContactId to be true ', () => {
      let controller = makeController();
      expect(controller.isSelectedContactId).to.be.true;
    });

    it('check other variables  ', () => {
      let controller = makeController();
      expect(controller.avatarInitials).to.be.defined;
      expect(controller.firstInitial).to.be.defined;
      expect(controller.lastInitial).to.be.defined;
      expect(controller.selectedContactAddress).to.be.an('array');
      expect(controller.contactDetail).to.be.an('array');
    });

    it('loadContactDetails to be called with contactDetails', () => {
      let controller = makeController();
      let spy = sinon.spy(controller, 'loadContactDetails');
      controller.init();
      expect(spy).to.be.calledWith(controller.contactsDetails);
    });

    it('handleContactDetail to be called with singleContactDetail', () => {
      let controller = makeController();
      let spy = sinon.spy(controller, 'handleContactDetail');
      controller.loadContactDetails(controller.contactsDetails);
      expect(spy).to.be.calledWith(controller.singleContactDetail);
      expect(controller.singleContactDetail).to.be.an('array').and.have.length.above(0);
      expect(controller.avatarInitials).to.be.equal(controller.firstInitial + controller.lastInitial);
    });

    it('getAddressDetail(vm.contactDetail) to be called with singleContactDetail', () => {
      let controller = makeController();
      let spy = sinon.spy(controller, 'getAddressDetail');
      controller.handleContactDetail(controller.singleContactDetail);
      expect(spy).to.be.calledWith(controller.contactDetail);
    });

  });

  describe('Filter', () => {
    let contactDetail = {};
    beforeEach(function(){
      contactDetail = MockData.contactDetail();
    });

    it('filter should work properly', () => {
      let controller = makeController();
      expect($filter('getcontactdetails')(contactDetail, 'imAddress')).to.be.deep.equal(contactDetail);
      expect($filter('getcontactdetails')(contactDetail, 'homeURL')).to.be.empty.object;
      expect($filter('getcontactdetails')(contactDetail, 'workURL')).to.be.empty.object;
      expect($filter('getcontactdetails')(contactDetail, 'otherURL')).to.be.empty.object;
      expect($filter('getcontactdetails')(contactDetail, 'birthday')).to.be.empty.object;
      expect($filter('getcontactdetails')(contactDetail, 'anniversary')).to.be.empty.object;
      expect($filter('getcontactdetails')(contactDetail, 'custom')).to.be.empty.object;
    });

  });

  describe('Component', () => {
    // component/directive specs
    let component = ContactDetailComponent();

    it('includes the intended template',() => {
      expect(component.template).to.equal(ContactDetailTemplate);
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(ContactDetailController);
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

