import SidebarModule from '../sidebar.folders'
import CreateNewFolderController from './create.new.folder.controller';
import CreateNewFolderTemplate from './create.new.folder.html';
import MockData from '../../../../../test-helpers/mock-data';
import CoreModule from '../../../core/core';
import UiBootstrapModule from '../../../modal/ui.bootstrap.modal/ui.bootstrap.modal';

describe('CreateNewFolder', () => {
  let $rootScope, $scope, modalInstance, logger, folderList, createFolderResponse, routerHelper,
    vncConstant, module, mailService, makeController, $httpBackend;

  beforeEach(window.module(SidebarModule.name, CoreModule.name,UiBootstrapModule.name));
  beforeEach(inject((_$rootScope_, _logger_, _$modal_, _mailService_, _vncConstant_, _$httpBackend_, _routerHelper_) => {
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    modalInstance = _$modal_.open({
      templateUrl: CreateNewFolderTemplate
    });
    logger = _logger_;
    vncConstant = _vncConstant_;
    mailService = _mailService_;
    $httpBackend = _$httpBackend_;
    routerHelper = _routerHelper_;
    makeController = () => {
      return new CreateNewFolderController( logger, modalInstance, mailService, $rootScope, vncConstant);
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
    before(function() {
      folderList = MockData.folderListMockData();
      createFolderResponse = MockData.createFolderMockData();
    });

    beforeEach(function() {
      $httpBackend.whenGET(/.*/).respond('');
      $httpBackend.whenPOST(/.*/).respond('');
      $httpBackend.flush();
    });

    // controller specs
    it('should be created successfully', () => {
      let controller = makeController();
      expect(controller).to.be.defined;
    });

    it('should be defined', () => {
      let controller = makeController();
      expect(controller.folders).to.be.defined;
      expect(controller.selectColor).to.be.equal('Select color');
      expect(controller.availableColors).to.be.an('array').with.length(4);
    });

    it('should changed values', () => {
      let controller = makeController();
      controller.selectFolderColor('red');
      expect(controller.selectColor).to.be.equal('red');
    });

    it('should get folder list', () => {
      let controller = makeController();
      $httpBackend.expectPOST($rootScope.API_URL + '/getFolderList',{}).respond(folderList);
      $httpBackend.flush();
      controller.folders = {};
      expect(controller.folders).to.be.an.empty('object');
      controller.getfolders();
      $httpBackend.expectPOST($rootScope.API_URL + '/getFolderList',{}).respond(folderList);
      $httpBackend.flush();
      expect(controller.folders).to.be.an('object');
      expect(controller.folders.$.name).to.be.an('string');
      expect(controller.folders.$.color).to.be.a('number');
      if(controller.folders.folder){
        expect(controller.folders.folder).to.be.an('object');
        expect(controller.folders.folder.$.name).to.be.an('string');
        if(controller.folders.folder.folder){
          expect(controller.folders.folder.folder).to.be.an('array');
        }
      }
    });

    it('should create folder', () => {
      let controller = makeController();
      let spy = sinon.spy($rootScope, '$broadcast');
      let userFolder  = {
        view: 'contact',
        color: 3,
        name: 'testing'
      };
      $httpBackend.expectPOST($rootScope.API_URL + '/getFolderList',{}).respond(folderList);
      $httpBackend.flush();
      controller.folderName = 'testing';
      controller.folderId = 2;
      controller.selectColor = 'GREEN';
      controller.createFolder();
      $httpBackend.expectPOST($rootScope.API_URL + '/createFolder', userFolder).respond(createFolderResponse);
      $httpBackend.flush();
      expect(spy).to.have.been.calledWith('folder-added');
    });
  });
});
