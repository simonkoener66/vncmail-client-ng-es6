import HeaderModule from './header'
import HeaderController from './header.controller';
import HeaderComponent from './header.component';
import HeaderTemplate from './header.html';
import CoreModule from '../core/core';
import mockData from '../../../test-helpers/mock-data';

describe('Header', () => {
  let $rootScope, $scope, auth, $state, routerHelper, module, logger, $timeout,
      $interval, vncConstant, mailService, AUTH_EVENTS, makeController, $httpBackend;

  beforeEach(window.module(HeaderModule.name, CoreModule.name));
  beforeEach(inject((_$rootScope_, _auth_, _$state_, _routerHelper_,
                     _$interval_, _vncConstant_, _mailService_, _AUTH_EVENTS_, _logger_, _$httpBackend_, _$timeout_) => {
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    auth = _auth_;
    $state = _$state_;
    routerHelper = _routerHelper_;
    $interval = _$interval_;
    vncConstant = _vncConstant_;
    mailService = _mailService_;
    AUTH_EVENTS = _AUTH_EVENTS_;
    logger = _logger_;
    $httpBackend = _$httpBackend_;
    $timeout = _$timeout_;
    //$rootScope.$$listeners.auth-login-success=[];
    makeController = () => {
      return new HeaderController( $rootScope, auth, $state, routerHelper, $interval, vncConstant,
        logger, mailService, $scope, AUTH_EVENTS, $timeout );
    };
    routerHelper.configureStates(mockData.getMockStates());
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
    before(function() {
      module = angular.module("header");
    });

    it("header module should be registered", function() {
      expect(module).to.not.equal(null);
    });

    it("header module should be equal to HeaderModule", function() {
      expect(module).to.be.equal(HeaderModule);
    });
  });

  describe('Controller', () => {

    let getAllMailMockData;
    before(function() {
      getAllMailMockData = mockData.getTotalUnreadEmailMockData();
    });

    // controller specs
    it('Should change title on change parentTitle ', function() {
      let controller = makeController();
      $httpBackend.whenGET(/.*/).respond('');
      $httpBackend.whenPOST(/.*/).respond('');
      $httpBackend.flush();
      $rootScope.parentTitle = 'UXF title';
      $rootScope.$apply();
      expect(controller.title).to.equal('UXF title');
    });

    it('has a name property ', () => {
      let controller = makeController();
      expect(controller.name).to.be.an('string');
      expect(controller.name).to.equal('header');
    });

    it('toggle-sidemenu event should be emit ', () => {
      let controller = makeController();
      let spy = sinon.spy($rootScope, '$emit');
      controller.sideMenuToggle();
      expect(spy).to.have.been.calledWith('toggle-sidemenu');
    });

    it('search event should be broadcast ', () => {
      let controller = makeController();
      let spy = sinon.spy($rootScope, '$broadcast');
      controller.searchEmail({which: 13});
      expect(spy).to.have.been.calledWith('search');
    });

    it('check unRead email', () => {
      let controller = makeController();
      $httpBackend.whenGET(/.*/).respond('');
      $httpBackend.whenPOST(/.*/).respond('');
      $httpBackend.flush();
      controller.getTotalUnreadEmail();
      $httpBackend.expectPOST($rootScope.API_URL + '/searchRequest').respond(getAllMailMockData);
      $httpBackend.flush();
      expect(controller.totalUnreadEmail).to.be.define;

    });
  });

  describe('Component', () => {
    // component/directive specs
    let component = HeaderComponent();

    it('includes the intended template',() => {
      expect(component.template).to.equal(HeaderTemplate);
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(HeaderController);
    });

    it('uses `controllerAs` syntax', () => {
      expect(component).to.have.property('controllerAs', 'vm');
    });

    it('uses `bindToController` syntax and equal to true', () => {
      expect(component).to.have.property('bindToController', true);
    });

    it('uses restrict and equal to EA', () => {
      expect(component).to.have.property('restrict', 'EA');
    });

    it('define scope object and length > 0', () => {
      expect(component.scope).to.be.an('object');
      expect(component.scope).to.not.empty;
    });
  });
});
