import MailInboxModule from '../mail.inbox/mail.inbox'
import MailRedirectController from './mail.redirect.controller.es6';
import MailRedirectTemplate from './mail.redirect.html';
import CoreModule from '../../../common/core/core';
import UiBootstrapModule from '../../../common/modal/ui.bootstrap.modal/ui.bootstrap.modal';

describe('MailRedirect', () => {
  let $rootScope, $scope, modalInstance, mailService, logger, id, $httpBackend, makeController;

  beforeEach(window.module(MailInboxModule.name, CoreModule.name, UiBootstrapModule.name));
  beforeEach(inject((_$rootScope_, _$modal_, _mailService_, _logger_, _$httpBackend_) => {
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    mailService = _mailService_;
    logger = _logger_;
    id = '7408';
    $httpBackend = _$httpBackend_;
    modalInstance = _$modal_.open({
      templateUrl: MailRedirectTemplate
    });
    makeController = () => {
      return new MailRedirectController( $scope, modalInstance, mailService, logger, id );
    };
  }));

  describe('Controller', () => {
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
      let spy = sinon.spy($modalInstance, 'close');
      $scope.toEmails = [{email: 'dhavald@zuxfdev.vnc.biz'}];
      controller.ok();
      $httpBackend.expectPOST($rootScope.API_URL + '/bounceMsg').respond();
      expect(spy).to.be.called;
    });

    it('check $modalInstance dismiss to be called', () => {
      let controller = makeController();
      let spy = sinon.spy($modalInstance, 'dismiss');
      controller.cancel();
      expect(spy).to.be.called;
    });
  });

});
