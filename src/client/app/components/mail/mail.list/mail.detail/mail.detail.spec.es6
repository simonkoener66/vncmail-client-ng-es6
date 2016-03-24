import uiRouter from 'angular-ui-router';
import MailDetailModule from './mail.detail'
import MailDetailController from './mail.detail.controller';
import MailDetailComponent from './mail.detail.component.es6';
import MailDetailTemplate from './mail.detail.html';
import CoreModule from '../../../../common/core/core';
import MockData from '../../../../../test-helpers/mock-data';

describe('Mail', () => {
  let $rootScope, $scope, mailService, module, logger, $sce, mailDetail, emailDetailMockData, makeController, makeIsolateScope;

  beforeEach(window.module( MailDetailModule.name, CoreModule.name, uiRouter ));
  beforeEach(inject((_$rootScope_, _$state_, _logger_, _$sce_, _$compile_, _mailService_) => {
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    logger = _logger_;
    mailService = _mailService_;
    $sce = _$sce_;
    makeController = () => {
      return new MailDetailController( logger, $sce, mailService, $rootScope );
    };
    $scope.mailDetail = MockData.emailDetailMockData();
    makeIsolateScope = () => {
      let element = angular.element('<vnc-mail-detail mail-detail="mailDetail"></vnc-mail-detail>');
      _$compile_(element)($rootScope);
      return element.isolateScope();
    };
  }));

  describe('Module', () => {
    //top-level specs: i.e., routes, injection, naming
    before(function() {
      module = angular.module("mail.detail");
    });

    it("should be registered", function() {
      expect(module).not.to.equal(null);
    });
  });

  describe('Controller', () => {
    before(function() {
      emailDetailMockData = MockData.emailDetailMockData();
    });
    // controller specs
    it('Ctrl should be defined', () => {
      let controller = makeController();
      expect(controller).to.be.defined;
    });

    it('emailDetailList should be defined', () => {
      let controller = makeController();
      controller.mailDetail = emailDetailMockData;
      expect(controller.emailDetailList.messages).to.have.length('0');
      controller.getEmailDetail(controller.mailDetail[0]);
      expect(controller.emailDetailList.messages).to.have.length('1');
    });

    it('_getMimePartEmailObject should return array', () => {
      let controller = makeController();
      let response = [{cd: 'attachment', ci: '<21d60d5a78bc99cab2a69891618224456f27d62b@zimbra>', ct: 'image/jpeg', filename: 'cat_2830677b.jpg', part: '2.2', s: '47599'}];
      let mimeParts = controller._getMimePartEmailObject(emailDetailMockData[0].mp, 'attachment');
      expect(mimeParts).to.be.deep.equal(response);
    });

    it('getBodyFromMultiPart should return content', () => {
      let controller = makeController();
      let response = `<html><body><div style="font-family: arial, helvetica, sans-serif; font-size: 12pt; color: #000000"><div><img src="cid:21d60d5a78bc99cab2a69891618224456f27d62b@zimbra"></div></div></body></html>`;
      let mimeParts = controller.getBodyFromMultiPart(emailDetailMockData[0].mp.mp);
      expect(mimeParts).to.be.equal(response);
    });

    it('populateMailToAndCCList should return array', () => {
      let controller = makeController();
      let ccs = [];
      let tos = [{
        email: 'dhavald@zuxfdev.vnc.biz',
        fullName: 'dhaval',
        displayName: 'dhaval'
      }];
      let messageDetail = {};
      controller.populateMailToAndCCList(messageDetail, tos, ccs);
      expect(messageDetail.mailsCcShow).to.be.defined;
      expect(messageDetail.mailsToShow).to.be.defined;
      expect(messageDetail.mailsCcShow).to.be.an('array');
      expect(messageDetail.mailsToShow).to.be.an('array');
      expect(messageDetail.mailsCcShow).to.have.length('0');
      expect(messageDetail.mailsToShow).to.have.length('1');
      expect(messageDetail.mailsCcShow).to.deep.equal(ccs);
      expect(messageDetail.mailsToShow).to.deep.equal(tos);
    });
    it('applySize should return size', () => {
      let controller = makeController();
      let index = 4;
      expect(controller.emailDetailList.messages).to.be.an('array');
      for(let i = 0; i < 5; i++){
        controller.emailDetailList.messages.push({isCollapsed: false});
      }
      controller.setCollapseOfMail(true, index);
      expect(controller.emailDetailList.messages[index].isCollapsed).to.be.true;
    });
  });

  describe('Component', () => {
    // component/directive specs
    let component = MailDetailComponent();

    it('includes the intended template',() => {
      expect(component.template).to.equal(MailDetailTemplate);
    });

    it('uses `controllerAs` syntax', () => {
      expect(component).to.have.property('controllerAs', 'vm');
    });

    it('uses `bindToController` syntax', () => {
      expect(component).to.have.property('bindToController', true);
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(MailDetailController);
    });
  });
});
