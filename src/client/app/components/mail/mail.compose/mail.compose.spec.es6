import MailInboxModule from '../mail.inbox/mail.inbox'
import MailComposeController from './mail.compose.controller.es6';
import MailComposeTemplate from './mail.compose.html';
import CoreModule from '../../../common/core/core';
import UiBootstrapModule from '../../../common/modal/ui.bootstrap.modal/ui.bootstrap.modal';

describe('MailCompose', () => {
  let $rootScope, $scope, logger, modalInstance, $uibModal, data, mailService, auth, moment, $sce, vncConstant, makeController;

  beforeEach(window.module(MailInboxModule.name, CoreModule.name, UiBootstrapModule.name));
  beforeEach(inject((_$rootScope_, _logger_, _$modal_, _$sce_, _mailService_, _$uibModal_, _auth_, _moment_, _vncConstant_) => {
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    logger = _logger_;
    mailService = _mailService_;
    auth = _auth_;
    $uibModal = _$uibModal_;
    data = '{"actionType": "COMPOSE"}';
    moment = _moment_;
    vncConstant = _vncConstant_;
    $sce = _$sce_;
    modalInstance = _$modal_.open({
      templateUrl: MailComposeTemplate
    });
    makeController = () => {
      return new MailComposeController( modalInstance, $rootScope, $sce, $scope, $uibModal, auth, data, logger, mailService, moment, vncConstant );
    };
  }));

  describe('Controller', () => {
    // controller specs
      it('has a title property', () => {
      let controller = new makeController();
      expect(controller).to.be.defined;
      controller.showBcc();
      expect(controller.isBccVisible).to.be.true;
      controller.closeBcc();
      expect(controller.isBccVisible).to.be.false;
    });
  });

});
