import ContactContactModule from './contacts.contacts'
import ContactContactController from './contacts.contacts.controller';
import ContactContactComponent from './contacts.contacts.component';
import ContactContactTemplate from './contacts.contacts.html';
import ContactModule from '../contacts.es6';
import SidebarServiceModule from '../../../common/services/sidebar.service/sidebar.service';
import CoreModule from '../../../common/core/core';
import contactComposeTemplate from '../contact.compose/contact.compose.html'
import contactComposeDeleteTemplate from '../contact.delete/contact.delete.html'
import contactMoveTemplate from '../contact.move/contact.move.html'
import mockData from '../../../../test-helpers/mock-data';


describe('Contacts.Contacts', () => {
  let $stateParams, makeController, routerHelper, module, $window, $httpBackend, $q, sidebarService, contactOperationsService,
      auth, $scope, AUTH_EVENTS, config, mailService, $state, contactDetailsService, vncConstant, $rootScope, $timeout;
  beforeEach(window.module( ContactContactModule.name, ContactModule.name, CoreModule.name, SidebarServiceModule.name));
  beforeEach(inject(( _$q_, _auth_, _AUTH_EVENTS_, _config_, _mailService_,_$state_, _contactDetailsService_,_vncConstant_,
                      _routerHelper_, _$rootScope_, _$window_, _$httpBackend_, _sidebarService_, _$timeout_, _contactOperationsService_) => {

    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $q = _$q_;
    auth = _auth_;
    AUTH_EVENTS = _AUTH_EVENTS_;
    config = _config_;
    mailService = _mailService_;
    $state = _$state_;
    contactDetailsService = _contactDetailsService_;
    vncConstant = _vncConstant_;
    $window = _$window_;
    $httpBackend = _$httpBackend_;
    routerHelper = _routerHelper_;
    sidebarService = _sidebarService_;
    $timeout = _$timeout_;
    contactOperationsService = _contactOperationsService_;
    makeController = () => {
      return new ContactContactController( $q, $scope, $state, $window, AUTH_EVENTS, auth, config, contactDetailsService,
        mailService, sidebarService, vncConstant,  $timeout, contactOperationsService );
    };
    let states = mockData.getMockStates();
    let temp = states.map(function(x){return x.state});
    states.splice(temp.indexOf('contacts'));
    states.splice(temp.indexOf('contacts.contacts'));
    states.splice(temp.indexOf('contacts.emailedContacts'));
    states.splice(temp.indexOf('contacts.trashContacts'));
    states.splice(temp.indexOf('contacts.distributionList'));
    routerHelper.configureStates(states);
  }));

  describe('Module', () => {
    //top-level specs: i.e., routes, injection, naming
    before(function() {
      module = angular.module("contacts.contacts");
    });

    it("contact.contact module should be registered", function() {
      expect(module).to.not.equal(null);
    });

    it("contact.contact module should be equal to ContactContactModule", function() {
      expect(module).to.be.equal(ContactContactModule);
    });
  });

  describe('Controller', () => {

    let getContactContact;
    beforeEach(function() {
      $httpBackend.whenGET(/.*/).respond('');
      $httpBackend.whenPOST(/.*/).respond('');
      $httpBackend.flush();
    });

    before(function() {
      getContactContact = mockData.getContactContact();
    });

    // controller specs
    it('Ctrl should be defined', () => {
      let controller = makeController();
      expect(controller).to.be.defined;
    });

    it('title to be equal to Contact List and elementId equal to all', () => {
      let controller = makeController();
      expect(controller.elementId).to.be.equal('all');
    });

    it('offset default to 0', () => {
      let controller = makeController();
      expect(controller.offset).to.be.equal(0);
    });

    it('check template variable that hold correct template', () => {
      let controller = makeController();
      expect(controller.contactComposeTemplate).to.be.equal(contactComposeTemplate);
      expect(controller.contactMoveTemplate).to.be.equal(contactMoveTemplate);
      expect(controller.contactComposeDeleteTemplate).to.be.equal(contactComposeDeleteTemplate);
    });

    it('check variables and types', () => {
      let controller = makeController();
      expect(controller.loadMore).to.be.true;
      expect(controller.isLoadingMoreContacts).to.be.false;
      expect(controller.defaultContactId).to.be.defined;
      expect(controller.defaultContactId).to.be.defined;
      expect(controller.singleContactList).to.be.an('array');
      expect(controller.singleDistributionList).to.be.an('array');
      expect(controller.noOfContacts).to.be.a('number').and.equal(0);
      expect(controller.contactOffset).to.be.a('number').and.equal(0);
      expect(controller.totalNoOfContacts).to.be.a('number').and.equal(0);
    });

    it('check contactList function', () => {
      let controller = makeController();
      $httpBackend.whenGET(/.*/).respond('');
      $httpBackend.whenPOST(/.*/).respond('');
      $httpBackend.flush();
      controller.contactList();
      $httpBackend.expectPOST($rootScope.API_URL + '/getFolderList').respond(getContactContact[0]);
      $httpBackend.flush();
    });

    it('check selectContact function', () => {
      let controller = makeController();
      let e = {ctrlKey: false};
      controller.selectContact('8713', e);
      expect(controller.multiSelectedContact).to.be.an('array').and.have.length(1);
    });

    it('check return value selectContact function', () => {
      let controller = makeController();
      let e = {ctrlKey: false};
      controller.selectContact('8713', e);
      expect(controller.isContactSelected('8713')).to.be.true;
    });

    it('check handleContactResponse function', () => {
      let controller = makeController();
      let x;
      let spy = sinon.spy(controller, 'loadContactList');
      controller.handleContactResponse(getContactContact[1]);
      expect(controller.loadMore).to.be.true;
      expect(controller.isLoadingMoreContacts).to.be.false;
      expect(controller.noOfContacts).to.be.equal(getContactContact[1].cn.length);
      expect(spy).to.be.calledWith(getContactContact[1].cn);
    });

    it('check loadContactList function', () => {
      let controller = makeController();

      let spy = sinon.spy(contactDetailsService, 'setContactDetails');
      controller.loadContactList(getContactContact[1].cn);
      let len = getContactContact[1].cn.length -1;
      expect(controller.lastContactId).to.be.equal(getContactContact[1].cn[len].$.id);
      expect(controller.lastSfValue).to.be.equal(getContactContact[1].cn[len].$.sf);
      expect(controller.defaultContactId).to.be.equal(getContactContact[1].cn[0].$.id);
      expect(controller.avatarName).to.be.a('string').and.have.length(2);
      expect(controller.contacts).to.be.an('array').and.have.length(1);
      expect(controller.contacts[0]).to.have.property('avatarName');
      expect(controller.contacts[0]).to.have.property('displayName');
      expect(controller.contacts[0]).to.have.property('id');
      expect(spy).to.be.calledWith(controller.sendContacts);
    });

    it('check loadDistributionList function', () => {
      let controller = makeController();
      let mockDataLoadDistributionList = getContactContact[2];
      controller.loadDistributionList(mockDataLoadDistributionList);
      expect(controller.defaultContactId).to.be.a('string').and.equal(mockDataLoadDistributionList[0].dl[0].$.id);
      expect(controller.contacts).to.be.an('array').and.have.length.above(1);
    });

    it('check contactPagination function', () => {
      let controller = makeController();
      controller.detailUrl = 'trashContacts';
      $httpBackend.whenGET(/.*/).respond('');
      $httpBackend.whenPOST(/.*/).respond({});
      $httpBackend.flush();
      controller.contactPagination('a','A','B');
      expect(controller.startValue).to.be.a('string').and.equal('A');
      expect(controller.endValue).to.be.a('string').and.equal('B');
      expect(controller.elementId).to.be.a('string').and.equal('a');
      $httpBackend.expectPOST($rootScope.API_URL + '/searchRequest').respond(getContactContact[2]);
      $httpBackend.flush();
    });

  });

  describe('Component', () => {
    // component/directive specs
    let component = ContactContactComponent();

    it('includes the intended template',() => {
      expect(component.template).to.equal(ContactContactTemplate);
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(ContactContactController);
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
