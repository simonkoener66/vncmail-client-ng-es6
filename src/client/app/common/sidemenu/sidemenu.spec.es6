import SideMenuModule from './sidemenu'
import SideMenuController from './sidemenu.controller';
import SideMenuComponent from './sidemenu.component';
import SideMenuTemplate from './sidemenu.html';
import CodeModule from '../core/core';
import mockData from '../../../test-helpers/mock-data';

describe('SideMenu', () => {
    let $rootScope, routerHelper, $state, auth, module, makeController;

    beforeEach(window.module(SideMenuModule.name, CodeModule.name));
    beforeEach(inject((_$rootScope_, _routerHelper_, _$state_, _auth_) => {
        $rootScope = _$rootScope_;
        routerHelper = _routerHelper_;
        $state = _$state_;
        auth = _auth_;
        makeController = () => {
            return new SideMenuController( $rootScope, routerHelper, $state, auth );
        };
        // configure routes in provider
        routerHelper.configureStates(mockData.getMockStates());
    }));

    describe('Module', () => {
        // top-level specs: i.e., routes, injection, naming
      before(function() {
        module = angular.module("sidemenu");
      });

      it("should be registered", function() {
        expect(module).not.to.equal(null);
      });
    });

    describe('Controller', () => {
        // controller specs
        it('should be created successfully', () => {
            let controller = makeController();
            expect(controller).to.be.defined;
        });

        it('initialize sideMenu to false', () => {
            let controller = makeController();
            expect(controller.sidemenu).to.be.false;
        });

        it("should broadcast something", function() {
            let spy = sinon.spy($rootScope, '$emit');
            let controller = makeController();
            controller.sideMenuToggle();
            expect(spy).to.have.been.calledWith('toggle-sidemenu');
        });

        it('should hide to sideMenu', () => {
          let controller = makeController();
          $rootScope.$emit('toggle-sidemenu', false);
          expect(controller.sidemenu).to.be.true;
        });

        it('should get navigation routes', () => {
          let controller = makeController();
          controller.getNavRoutes();
          expect(controller.navRoutes).to.have.length('4');
        });

    });

    describe('Component', () => {
        // component/directive specs
        let component = SideMenuComponent();

        it('includes the intended template',() => {
            expect(component.template).to.equal(SideMenuTemplate);
        });

        it('uses `controllerAs` syntax', () => {
            expect(component).to.have.property('controllerAs');
        });

        it('invokes the right controller', () => {
            expect(component.controller).to.equal(SideMenuController);
        });
    });
});
