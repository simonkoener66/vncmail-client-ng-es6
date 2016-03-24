import LoginModule from './login'
import LoginController from './login.controller';
import LoginComponent from './login.component';
import LoginTemplate from './login.html';
import CoreModule from '../../common/core/core'
import mockData from '../../../test-helpers/mock-data';

describe('Login', () => {
    let $rootScope, $scope, $location, logger, auth, module, AUTH_EVENTS, $state, config, makeController, routerHelper, $httpBackend;

    beforeEach(window.module( LoginModule.name, CoreModule.name));
    beforeEach(inject((_$rootScope_, _$location_, _logger_, _auth_, _AUTH_EVENTS_, _$state_, _$httpBackend_, _routerHelper_, _config_) => {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $location = _$location_;
        logger = _logger_;
        auth = _auth_;
        AUTH_EVENTS = _AUTH_EVENTS_;
        $state = _$state_;
        config = _config_;
        $httpBackend = _$httpBackend_;
        routerHelper = _routerHelper_;
        makeController = () => {
            return new LoginController( $scope, $location, logger, auth, AUTH_EVENTS );
        };
      // configure routes in provider
      let states = mockData.getMockStates();
      let temp = states.map(function(x){return x.state});
      states.splice(temp.indexOf('login'));
      routerHelper.configureStates(states);
    }));

    describe('Module', () => {
        //top-level specs: i.e., routes, injection, naming
      before(function() {
        module = angular.module("login");
      });

      it("should be registered", function() {
        expect(module).not.to.equal(null);
      });

      it('should map state login to url /login ', function() {
        expect($state.href('login', {})).to.equal('/login');
      });
    });

    describe('Controller', () => {
      beforeEach(function() {
        $httpBackend.whenGET(/.*/).respond('');
        $httpBackend.whenPOST(/.*/).respond('');
        $httpBackend.flush();
      });
        // controller specs
        it('Ctrl should be defined', () => {
            let controller = makeController();
            expect(controller).to.be.defined;
        });
        it('has a title property', () => {
            let controller = makeController();
            expect(controller.title).to.equal('Login');
        });

        it('Ctrl has initial values', () => {
          let controller = makeController();
          expect(controller.showError).to.equal(false);
          expect(controller.errorMessage).not.to.be.ok;
          expect(controller.user).to.be.an('object');
        });

        it('should give error on wrong credientials', () => {
          let controller = makeController();
          let spy = sinon.spy($rootScope, '$broadcast');
          controller.user.username = 'dummy@dummy.vnc.biz';
          controller.user.password = 'dummy';
          expect(controller.user).to.have.all.keys('username', 'password');
          controller.login();
          $httpBackend.expectPOST($rootScope.API_URL + '/authToken',{username: 'dummy@dummy.vnc.biz', password: 'dummy'}).respond(401, {});
          $httpBackend.flush();
          expect(spy).to.have.been.calledWith('auth-login-failed');
          //expect($location.path()).to.be.equal('/login');
          expect(controller.showError).to.equal(true);
          expect(controller.errorMessage).to.be.ok;
        });

        it('should give success', () => {
          let controller = makeController();
          let spy = sinon.spy($rootScope, '$broadcast');
          controller.user.username = 'dhavald@zuxfdev.vnc.biz';
          controller.user.password = 'zuxfdev!1';
          expect(controller.user).to.have.all.keys('username', 'password');
          controller.login();
          $httpBackend.expectPOST($rootScope.API_URL + '/authToken',{username: 'dhavald@zuxfdev.vnc.biz', password: 'zuxfdev!1'}).respond('');
          $httpBackend.flush();
          expect(spy).to.have.been.calledWith('auth-login-success');
          //expect($location.path()).to.be.equal('/mail/inbox');
      });
    });

    describe('Component', () => {
         //component/directive specs
        let component = LoginComponent();

        it('includes the intended template',() => {
            expect(component.template).to.equal(LoginTemplate);
        });

        it('uses `controllerAs` syntax', () => {
            expect(component).to.have.property('controllerAs');
        });

        it('invokes the right controller', () => {
            expect(component.controller).to.equal(LoginController);
        });
    });

});
