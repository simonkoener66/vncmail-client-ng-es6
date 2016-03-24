import SidebarModule from '../sidebar.folders'
import ShareFolderController from './share.folder.modal.controller';
import ShareFolderTemplate from './share.folder.modal.html';
import MockData from '../../../../../test-helpers/mock-data';
import CoreModule from '../../../core/core';
import UiBootstrapModule from '../../../modal/ui.bootstrap.modal/ui.bootstrap.modal';

describe('ShareFolder', () => {
  let $rootScope, $mdDialog, logger, routerHelper , module, mailService, makeController, $httpBackend, data, auth;

  beforeEach(window.module(SidebarModule.name, CoreModule.name,UiBootstrapModule.name));
  beforeEach(inject((_$rootScope_, _logger_, _$mdDialog_, _mailService_, _vncConstant_, _$httpBackend_, _routerHelper_, _auth_) => {
    $rootScope = _$rootScope_;
    logger = _logger_;
    auth = _auth_;
    mailService = _mailService_;
    $httpBackend = _$httpBackend_;
    $mdDialog = _$mdDialog_;
    routerHelper = _routerHelper_;
    data = {
      $:{
        name: 'test',
        id: 5
      }
    };
    makeController = () => {
      return new ShareFolderController( logger, $mdDialog, mailService, data, auth, $rootScope );
    };
    // configure routes in provider
    routerHelper.configureStates(MockData.getMockStates());
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
    before(function() {
      module = angular.module("sidebarfolders");
    });

    it("App module should be registered", function() {
      expect(module).to.not.equal(null);
    });

    it("should be equal to AppModule", function() {
      expect(module).to.equal(SidebarModule);
    });
  });

  describe('Controller', () => {
    beforeEach(function() {
      $httpBackend.whenGET(/.*/).respond('');
      $httpBackend.whenPOST(/.*/).respond('');
      $httpBackend.flush();
    });

    // controller specs
    it('should be created successfully', () => {
      let controller = makeController();
      expect(controller).to.be.defined;
      expect(controller.data).to.be.defined;
    });

    it('should be defined', () => {
      let controller = makeController();
      if( controller.details && controller.details.$){
        expect(controller.details).to.be.defined;
        expect(controller.folderName).to.be.defined;
        expect(controller.folderId).to.be.defined;
        expect(controller.folderName).to.be.equal('test');
        expect(controller.folderId).to.be.equal(5);
      }
      expect(controller.form1).to.be.equal(true);
      expect(controller.form2).to.be.equal(false);
      expect(controller.form3).to.be.equal(false);
      expect(controller.reqPending).to.be.equal(false);
      expect(controller.toEmails).to.be.an.empty('array');
    });

    it('should changed values', () => {
      let controller = makeController();
      controller.next();
      expect(controller.form1).to.be.equal(false);
      expect(controller.form2).to.be.equal(true);
      controller.sharewith = 'guest';
      expect(controller.external).to.be.equal(false);

    });

    it('should Share folder', () => {
      let controller = makeController();
      controller.toEmails = [
        {
          name:'rafiq',
          email:'muhammadrafique@vnc.biz'
        }
      ];
      controller.sharewith = 'usr';
      controller.shareRole = 'r';
      controller.notes = 'test note';
      let spy = sinon.spy($rootScope, '$broadcast');
      let request = {
        id: 5,
        op: 'grant',
        gt: 'usr',
        d: ["muhammadrafique@vnc.biz"],
        perm:  'r'
      };
      let options = {
        id: 5,
        emailInfo: ["muhammadrafique@vnc.biz"],
        notes: 'test note'
      };
      controller.share();
      $httpBackend.expectPOST($rootScope.API_URL + '/folderAction', request).respond('success');
      $httpBackend.flush();
      expect(spy).to.have.been.calledWith('Sharing Changed');
      expect(spy).to.have.been.calledWith('folder-added');
      $httpBackend.expectPOST($rootScope.API_URL + '/sendShareNotification', options).respond('success');
    });
  });
});
