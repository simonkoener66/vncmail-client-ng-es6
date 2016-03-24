import ContactsModule from '../contacts.es6';
import ContactMoveController from './contact.move.controller';
import ContactMoveTemplate from './contact.move.html';
import CoreModule from '../../../common/core/core';
import UiBootstrapModule from '../../../common/modal/ui.bootstrap.modal/ui.bootstrap.modal';
import mockData from '../../../../test-helpers/mock-data';

describe('Contact Move', () => {
  let logger, $modalInstance, $stateParams, routerHelper, $state, module, mailService, makeController, $httpBackend, $rootScope, vncConstant;
  beforeEach(window.module( ContactsModule.name, CoreModule.name, UiBootstrapModule.name ));
  beforeEach(inject((_logger_, _$state_, _mailService_, _vncConstant_, _$modal_, _$httpBackend_, _$rootScope_, _routerHelper_) => {
    $modalInstance = _$modal_.open({ template: ContactMoveTemplate });
    $rootScope = _$rootScope_;
    logger = _logger_;
    vncConstant = _vncConstant_;
    $stateParams = {contactId: 8516};
    $state = _$state_;
    mailService = _mailService_;
    $httpBackend = _$httpBackend_;
    routerHelper = _routerHelper_;
    makeController = () => {
      return new ContactMoveController( $state, $modalInstance, $stateParams, mailService, vncConstant, logger );
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
    let getMoveContactMockData;
    before(function() {
      getMoveContactMockData = mockData.getMoveContactMockData();
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

    it('SystemFolders should be define', () => {
      let controller = makeController();
      expect(controller.SystemFolders).to.be.defined;
      expect(controller.SystemFolders).to.be.an('object').and.not.be.empty;
    });

    it('SystemFolders have property folder to be an array and not be empty', () => {
      let controller = makeController();
      expect(controller.SystemFolders).to.have.property('folder');
      expect(controller.SystemFolders.folder).to.be.defined;
      expect(controller.SystemFolders.folder).to.be.an('array').and.not.be.empty;
    });

    it('check $modalInstance dismiss to be called', () => {
      let controller = makeController();
      let spy = sinon.spy($modalInstance, 'dismiss');
      controller.cancel();
      expect(spy).to.be.called;
    });

    it('moveContact request should be call ', () => {
      let controller = makeController();
      controller.selectedFolderId = 7;
      let spy = sinon.spy($modalInstance, 'dismiss');
      controller.moveContact();
      $httpBackend.expectPOST($rootScope.API_URL + '/contactAction').respond(getMoveContactMockData);
      $httpBackend.flush();
      expect(spy).to.be.called;
    });
  });

});
