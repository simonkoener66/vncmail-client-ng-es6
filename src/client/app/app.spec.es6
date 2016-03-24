import AppModule from './app.module'
import AppController from './app.controller';
import AppComponent from './app.component';
import AppTemplate from './app.html';

describe('App', () => {
    let $rootScope, $scope, makeController, logger, module, config, timeout, auth, $interval, dragularService, mailService;
    beforeEach(window.module(AppModule.name));
    beforeEach(inject((_$rootScope_, _logger_, _config_, _$timeout_, _auth_, _$interval_, _dragularService_ , _mailService_) => {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        config = _config_;
        logger = _logger_;
        $interval = _$interval_;
        timeout = _$timeout_;
        dragularService = _dragularService_;
        mailService = _mailService_;
        auth = _auth_;
        makeController = () => {
            return new AppController( $interval, $scope, $rootScope, timeout, auth, config, dragularService, logger, mailService );
        };
    }));

    describe('Module', () => {
        // top-level specs: i.e., routes, injection, naming
        before(function() {
          module = angular.module("app");
        });

        it("App module should be registered", function() {
          expect(module).to.not.equal(null);
        });

        it("should be equal to AppModule", function() {
          expect(module).to.equal(AppModule);
        });
    });

    describe('Component', () => {
          // top-level specs: i.e., routes, injection, naming
      let component = AppComponent();

      it('includes the intended template',() => {
        expect(component.template).to.equal(AppTemplate);
      });

      it('check controller',() => {
        expect(component.controller).to.equal(AppController);
      });

      it('uses `controllerAs` syntax', () => {
        expect(component).to.have.property('controllerAs', 'vm');
      });

      it('uses `bindToController` syntax', () => {
        expect(component).to.have.property('bindToController', true);
      });

      it('uses `restrict` and equal to E', () => {
        expect(component).to.have.property('restrict', 'E');
      });

      it('scope should be define', () => {
        expect(component.scope).to.be.define;
        expect(component.scope).to.be.a('object');
      });
    });

    describe('Controller', () => {
        // controller specs
        it('should be created successfully', () => {
            let controller = makeController();
            expect(controller).to.be.defined;
        });

        it("should broadcast something", function() {
            let spy = sinon.spy($rootScope, '$emit');
            let controller = makeController();
            controller.sideMenuToggle();
            expect(spy).to.have.been.calledWith('toggle-sidemenu');
            $rootScope.$emit.restore();
        });

        it('initialize sideMenu to false', () => {
            let controller = makeController();
            expect(controller.sidemenu).to.be.false;
        });

        describe('after sideMenu Toggle',() => {
            it('should hide to sideMenu',() => {
                let controller = makeController();
                controller.sideMenuToggle();
                expect(controller.sidemenu).to.be.false;
            });

            it('should toggle to sideMenu', () => {
                let controller = makeController();
                $rootScope.$emit('toggle-sidemenu', false);
                expect(controller.sidemenu).to.be.true;
                $rootScope.$emit('toggle-sidemenu', true);
                expect(controller.sidemenu).to.be.false;
            });

        });

    });
});
