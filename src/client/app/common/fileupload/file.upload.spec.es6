import FileUploadModule from './file.upload'
import FileUploadController from './file.upload.controller';
import FileUploadComponent from './file.upload.component';
import FileUploadTemplate from './file.upload.html';
import CoreModule from '../core/core';
import mockData from '../../../test-helpers/mock-data';

describe('FileUpload', () => {
  let $rootScope, logger, mailService, makeController, routerHelper, module, $httpBackend;

  beforeEach(window.module(FileUploadModule.name, CoreModule.name));
  beforeEach(inject((_$rootScope_, _logger_, _mailService_, _$httpBackend_, _routerHelper_) => {
    $rootScope = _$rootScope_;
    logger = _logger_;
    mailService = _mailService_;
    $httpBackend = _$httpBackend_;
    routerHelper = _routerHelper_;
    makeController = () => {
      return new FileUploadController( mailService, logger );
    };
    // configure routes in provider
    routerHelper.configureStates(mockData.getMockStates());
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
    before(function() {
      module = angular.module("fileUpload");
    });

    it("fileUpload module should be registered", function() {
      expect(module).to.not.equal(null);
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
      });

      it('files should be an array', () => {
          let controller = makeController();
          expect(controller.files).to.be.an('array').and.empty;
      });

      it('multiple should be a boolean value', () => {
          let controller = makeController();
          expect(controller.multiple).to.be.an('boolean');
      });

      it('check file upload', () => {
          let controller = makeController();
          let getMockData = mockData.fileUploadMockData();
          controller.uploadFiles(getMockData[0]);
          $httpBackend.expectPOST($rootScope.API_URL + '/upload').respond(getMockData[1]);
          $httpBackend.flush();
          expect(controller.files).to.be.an('array');
          expect(controller.files).to.have.length.above(0);
      });
  });

  describe('Component', () => {
      // component/directive specs
      let component = FileUploadComponent();

      it('includes the intended template',() => {
        expect(component.template).to.equal(FileUploadTemplate);
      });

      it('uses `controllerAs` syntax', () => {
        expect(component).to.have.property('controllerAs', 'vm');
      });

      it('uses `bindToController` syntax', () => {
        expect(component).to.have.property('bindToController', true);
      });

      it('invokes the right controller', () => {
        expect(component.controller).to.equal(FileUploadController);
      });
  });
});
