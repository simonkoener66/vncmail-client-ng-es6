import TagModule from '../tag'
import CreateNewTagController from './create.new.tag.controller';
import CreateNewTagTemplate from './create.new.tag.html';
import CoreModule from '../../core/core';
import SidebarServiceModule from '../../services/sidebar.service/sidebar.service';
import UiBootstrapModule from '../../modal/ui.bootstrap.modal/ui.bootstrap.modal';
import MockData from '../../../../test-helpers/mock-data';

describe('CreateNewTag', () => {
    let $rootScope, modalInstance, sidebarService, module, logger, routerHelper, makeController, $httpBackend;

    beforeEach(window.module(TagModule.name, CoreModule.name, UiBootstrapModule.name, SidebarServiceModule.name));
    beforeEach(inject((_$rootScope_, _$modal_, _sidebarService_, _logger_, _$httpBackend_, _routerHelper_) => {
        $rootScope = _$rootScope_;
        modalInstance = _$modal_.open({
            templateUrl: CreateNewTagTemplate
        });
        sidebarService = _sidebarService_;
        logger = _logger_;
        $httpBackend = _$httpBackend_;
        routerHelper = _routerHelper_;
        makeController = () => {
            return new CreateNewTagController( modalInstance, $rootScope, logger, sidebarService );
        };
        // configure routes in provider
        routerHelper.configureStates(MockData.getMockStates());
    }));

    describe('Module', () => {
        // top-level specs: i.e., routes, injection, naming
      before(function() {
        module = angular.module("tag");
      });

      it("should be registered", function() {
        expect(module).not.to.equal(null);
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

        it('should be defined', () => {
          let controller = makeController();
          expect(controller.selectColor).to.be.equal('Select color');
          expect(controller.availableColors).to.be.an('array').with.length(7);
          expect(controller.rgbCodes).to.be.an('object');
        });

        it('should changed values', () => {
          let controller = makeController();
          controller.selectTagColor('Blue');
          expect(controller.selectColor).to.be.equal('Blue');
        });

        it('should update values on promises response', () => {
          let controller = makeController();
          let mockResponse = MockData.newTagMockData();
          controller.tagName = 'testing';
          controller.selectColor = 'Green';
          let spy = sinon.spy($rootScope, '$broadcast');
          controller.addNewTag();
          $httpBackend.expectPOST($rootScope.API_URL + '/createTag').respond(mockResponse);
          $httpBackend.flush();
          expect(spy).to.have.been.calledWith('tag-added');
        });

        it('should dismiss colorpicker', () => {
          let controller = makeController();
          controller.isCustomColor = true;
          controller.dismissColorPicker();
          expect(controller.isCustomColor).to.be.false;
        });
      });

});
