import MailInboxModule from '../mail.inbox/mail.inbox'
import MailFullScreenController from './mail.fullscreen.controller.es6';
import MailFullScreenTemplate from './mail.fullscreen.html';
import CoreModule from '../../../common/core/core';
import UiBootstrapModule from '../../../common/modal/ui.bootstrap.modal/ui.bootstrap.modal';

describe('MailFullScreen', () => {
  let $rootScope, modalInstance, $uibModal, detail, index, key, makeController;

  beforeEach(window.module(MailInboxModule.name, CoreModule.name, UiBootstrapModule.name));
  beforeEach(inject((_$rootScope_, _$modal_) => {
    $rootScope = _$rootScope_;
    detail = {};
    index = 0;
    key = 'Today';
    modalInstance = _$modal_.open({
      templateUrl: MailFullScreenTemplate
    });
    makeController = () => {
      return new MailFullScreenController( modalInstance, index, key, detail );
    };
  }));

  describe('Controller', () => {
    // controller specs
      it('controler should be defined', () => {
      let controller = new makeController();
      expect(controller).to.be.defined;
    });

    it('check $modalInstance close to be called', () => {
      let controller = makeController();
      let spy = sinon.spy($modalInstance, 'close');
      controller.ok();
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
