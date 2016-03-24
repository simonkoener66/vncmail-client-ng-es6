import ContactsModule from '../contacts.es6';
import ContactDeleteController from './contact.delete.controller';
import ContactDeleteTemplate from './contact.delete.html';
import CoreModule from '../../../common/core/core';
import ContactsContactsModule from '../contacts.contacts/contacts.contacts';
import UiBootstrapModule from '../../../common/modal/ui.bootstrap.modal/ui.bootstrap.modal';
import mockData from '../../../../test-helpers/mock-data';

describe('Contact Delete', () => {
  let logger, $modalInstance, $stateParams, routerHelper, module, $state, mailService, makeController, $httpBackend, contactOperationsService, $rootScope;
  beforeEach(window.module( ContactsModule.name, ContactsContactsModule.name, CoreModule.name, UiBootstrapModule.name ));
  beforeEach(inject((_logger_, _$state_, _mailService_, _$modal_, _$httpBackend_, _$rootScope_, _routerHelper_, _contactOperationsService_) => {
    $modalInstance = _$modal_.open({ template: ContactDeleteTemplate });
    $rootScope = _$rootScope_;
    logger = _logger_;
    $stateParams = {contactId: 8714};
    $state = _$state_;
    mailService = _mailService_;
    $httpBackend = _$httpBackend_;
    routerHelper = _routerHelper_;
    contactOperationsService = _contactOperationsService_;
    makeController = () => {
      return new ContactDeleteController( logger, $modalInstance, $stateParams, $state, mailService, contactOperationsService );
    };
    // configure routes in provider
    let states = mockData.getMockStates();
    let temp = states.map(function(x){return x.state});
    states.splice(temp.indexOf('contacts'));
    routerHelper.configureStates(states);
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
    before(function() {
      module = angular.module("contacts");
    });

    it("header module should be registered", function() {
      expect(module).to.not.equal(null);
    });

  });

  describe('Controller', () => {
    // controller specs

    let getDeleteContactMockData;
    before(function() {
      getDeleteContactMockData = mockData.getDeleteContactMockData();
    });

    beforeEach(function() {
      $httpBackend.whenGET(/.*/).respond('');
      $httpBackend.whenPOST(/.*/).respond('');
      $httpBackend.flush();
    });

    it('Ctrl should be defined', () => {
      let controller = makeController();
      expect(controller).to.be.defined;
    });

    it('mailService should be define', () => {
      let controller = makeController();
      expect(controller.mailService).to.be.define;
    });

    it('logger should be define', () => {
      let controller = makeController();
      expect(controller.logger).to.be.define;
    });

    it('check $modalInstance dismiss to be called', () => {
      let controller = makeController();
      let spy = sinon.spy($modalInstance, 'dismiss');
      controller.cancel();
      expect(spy).to.be.called;
    });

    it('deleteContact request should be call', () => {
      let controller = makeController();
      let spy = sinon.spy($modalInstance, 'dismiss');
      controller.deleteContact();
      $httpBackend.expectPOST($rootScope.API_URL + '/contactAction').respond(getDeleteContactMockData);
      $httpBackend.flush();
      expect(spy).to.be.called;
    });
  });

});
