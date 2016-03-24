import ContactModule from '../../components/contacts/contacts.es6';
import ContextMenuModule from './contextMenu.es6';
import ContextMenuController from './contextMenu.controller.es6';
import ContextMenuComponent from './contextMenu.component.es6';
import CoreModule from '../core/core';
import SidebarServiceModule from '../services/sidebar.service/sidebar.service';
import mockData from '../../../test-helpers/mock-data';

  describe('Contact contextMenu', () => {
    let logger, $compile, routerHelper, makeIsolateParent, makeController, $rootScope, module, $httpBackend, makeIsolateChild;
    beforeEach(window.module( ContactModule.name, SidebarServiceModule.name, CoreModule.name, ContextMenuModule.name));
    beforeEach(inject((_logger_, _$compile_, _$rootScope_, _routerHelper_, _$httpBackend_) => {
      $rootScope = _$rootScope_;
      logger = _logger_;
      $compile = _$compile_;
      $httpBackend = _$httpBackend_;
      routerHelper = _routerHelper_;
      makeController = () => {
        return new ContextMenuController( $compile, logger );
      };
      makeIsolateParent  = () => {
        let element = angular.element('<div context-menu></div>');
        _$compile_(element)($rootScope);
        return {
          xElement: element,
          xScope: element.isolateScope()
        }
      };

      makeIsolateChild  = () => {
        let innerElement = angular.element('<div id="contextMenu" class="context-menu"><context-menu-detail></context-menu-detail></div>');
        _$compile_(innerElement)($rootScope);
        return {
          xElement: innerElement,
          xScope: innerElement.isolateScope()
        }
      };
      // configure routes in provider
      let states = mockData.getMockStates();
      let temp = states.map(function(x){return x.state});
      states.splice(temp.indexOf('contacts'));
      routerHelper.configureStates(states);
    }));
    beforeEach(function() {
      $httpBackend.whenGET(/.*/).respond('');
      $httpBackend.whenPOST(/.*/).respond('');
      $httpBackend.flush();
    });

    describe('Module', () => {
      before(function() {
        module = angular.module("contextMenu");
      });

      it("should be registered", function() {
        expect(module).not.to.equal(null);
      });
    });

    describe('Controller', () => {
      // controller specs
      it('Ctrl should be defined', () => {
        let controller = makeController();
        expect(controller).to.be.defined;
        expect(controller.logger).to.be.defined;
        expect(controller.compile).to.be.defined;
      });
    });

    describe('Link', () => {
      // controller specs
      it('Ctrl should be defined', () => {
        let controller = makeIsolateParent().xScope;
        expect(controller).to.be.defined;
      });

      it('Element should be defined', () => {
        let element = makeIsolateParent().xElement;
        expect(element).to.be.defined;
      })
    });

    describe('innerLink', () => {
      // controller specs
      it('Ctrl should be defined', () => {
        let controller = makeIsolateChild().xScope;
        expect(controller).to.be.defined;
      });

      it('Element should be defined', () => {
        let element = makeIsolateChild().xElement;
        expect(element).to.be.defined;
      });
    });

    describe('context menu Events', () => {
      // controller specs
      it('Should change values', () => {
        let pController = makeIsolateParent().xScope;
        let pElement = makeIsolateParent().xElement;
        let cController = makeIsolateChild().xScope;
        let cElement = makeIsolateChild().xElement;
        pElement.triggerHandler({
          type : "mousemove",
          pageX: 48,
          pageY: 102
        });
        expect(pController.contextMenuPosition).to.be.defined;
        expect(pController.contextMenuType).to.be.defined;
        pElement.triggerHandler({
          type : "mousedown"
        });
        expect(pController.contextMenuPosition).to.be.defined;
        expect(pController.contextMenuType).to.be.defined;
        expect(pController.contextMenuPosition).not.to.be.ok;
        expect(pController.contextMenuType).not.to.be.ok;
      })
    });

    describe('Component', () => {
      // component/directive specs
      let component = ContextMenuComponent();

      it('uses `controllerAs` syntax', () => {
        expect(component).to.have.property('controllerAs');
      });

      it('invokes the right controller', () => {
        expect(component.controller).to.equal(ContextMenuController);
      });
    });

});
