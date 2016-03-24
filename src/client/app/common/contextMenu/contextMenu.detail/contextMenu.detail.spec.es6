import ContactModule from '../../../components/contacts/contacts.es6';
import contextMenuDetailComponent from './contextMenu.detail.component.es6';
import ContextMenuDetailController from './contextMenu.detail.controller.es6';
import ContextMenuComponent from '../contextMenu.component.es6';
import CoreModule from '../../core/core';
import SidebarServiceModule from '../../services/sidebar.service/sidebar.service';
import mockData from '../../../../test-helpers/mock-data';

  describe('Contact contextMenuDetail', () => {
    let $uibModal, $q, $scope, $state, $rootScope, $timeout, logger, mailService, sidebarService, vncConstant, makeController, module, $httpBackend, $compile, $window;
    beforeEach(window.module( ContactModule.name, SidebarServiceModule.name, CoreModule.name));
    beforeEach(inject((_logger_, _$compile_, _$rootScope_, _$httpBackend_, _$q_, _mailService_, _$window) => {
      $rootScope = _$rootScope_;
      logger = _logger_;
      $compile = _$compile_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
      $q = _$q_;
       mailService =  _mailService_;
       $window = _$window_;
      makeController = () => {
        return new ContextMenuDetailController( $uibModal, $q, $scope, $state, $rootScope, $timeout, logger, mailService, sidebarService, vncConstant, $window);
      };
    beforeEach(function() {
      $httpBackend.whenGET(/.*/).respond('');
      $httpBackend.whenPOST(/.*/).respond('');
    });
  }));
    describe('Controller', () => {
      // controller specs
      it('Ctrl should be defined', () => {
        let controller = makeController();
        expect(controller).to.be.defined;
        expect(controller.logger).to.be.defined;
        expect(controller.compile).to.be.defined;
      });

      it('Remove Tag In contact', () => {
        let controller = makeController();
        let contactId = 327, tagName = 's';
        mailService.removeTagInContact(contactId, tagName, (res, err) => {
          console.log("SUCCESS");
        })
      });
    });


    describe('Component', () => {
      // component/directive specs
      let component = contextMenuDetailComponent();

      it('uses `controllerAs` syntax', () => {
        expect(component).to.have.property('controllerAs');
      });

      it('invokes the right controller', () => {
        expect(component.controller).to.equal(ContextMenuDetailController);
      });
  });
});
