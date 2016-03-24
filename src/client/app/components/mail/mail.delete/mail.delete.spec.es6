import MailListModule from '../mail.list/mail.list'
import MailDeleteController from './mail.delete.controller';
import MailDeleteTemplate from './mail.delete.html';
import CoreModule from '../../../common/core/core';
import UiBootstrapModule from '../../../common/modal/ui.bootstrap.modal/ui.bootstrap.modal';
import mockData from '../../../../test-helpers/mock-data'

describe('MailDelete', () => {
  let $rootScope, $scope, logger, id, $state, module, modalInstance, $uibModal, mailService, $httpBackend, makeController;

  beforeEach(window.module(MailListModule.name, CoreModule.name, UiBootstrapModule.name));
  beforeEach(inject((_$rootScope_, _logger_, _$state_, _$modal_, _mailService_, _$uibModal_, _$httpBackend_) => {
    $rootScope = _$rootScope_;
    logger = _logger_;
    $httpBackend = _$httpBackend_;
    mailService = _mailService_;
    $state = _$state_;
    modalInstance = _$modal_.open({
      templateUrl: MailDeleteTemplate
    });
    id = 1234;
    makeController = () => {
      return new MailDeleteController( modalInstance, mailService, logger, id );
    };
  }));

  describe('Module', () => {
    //top-level specs: i.e., routes, injection, naming
    before(function() {
      module = angular.module("mail.list");
    });

    it("should be registered", function() {
      expect(module).not.to.equal(null);
    });
  });

  describe('Controller', () => {
    let getDeleteConversationMockData;
    before(function() {
      getDeleteConversationMockData = mockData.getDeleteConversationMockData();
    });

    beforeEach(function() {
      $httpBackend.whenGET(/.*/).respond('');
      $httpBackend.whenPOST(/.*/).respond('');
      $httpBackend.flush();
    });

    // controller specs
    it('controller should be defined', () => {
      let controller = new makeController();
      expect(controller).to.be.defined;
    });

    it('check $modalInstance close to be called', () => {
      let controller = makeController();
      let spy = sinon.spy(modalInstance, 'close');
      controller.ok();
      $httpBackend.expectPOST($rootScope.API_URL + '/convAction').respond(getDeleteConversationMockData);
      $httpBackend.flush();
      expect(spy).to.be.called;
    });

    it('check $modalInstance dismiss to be called', () => {
      let controller = makeController();
      let spy = sinon.spy(modalInstance, 'dismiss');
      controller.cancel();
      expect(spy).to.be.called;
    });
  });
});
