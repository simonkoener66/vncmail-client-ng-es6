import SidebarModule from './sidebar'
import SidebarController from './sidebar.controller';
import SidebarComponent from './sidebar.component';
import SidebarTemplate from './sidebar.html';
import CoreModule from '../core/core';
import ServiceModule from '../services/service.component';
import mockData from '../../../test-helpers/mock-data';

describe('Sidebar', () => {
    let $rootScope, $scope, module, routerHelper, $state, auth, $httpBackend, sidebarService, mailService,
        makeController, vncConstant;

    beforeEach(window.module(SidebarModule.name, CoreModule.name, ServiceModule.name));
    beforeEach(inject((_$rootScope_, _routerHelper_, _$state_, _auth_, _sidebarService_, _$httpBackend_, _mailService_,
                       _vncConstant_) => {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new(); //inherited scope
        routerHelper = _routerHelper_;
        $state = _$state_;
        auth = _auth_;
        sidebarService = _sidebarService_;
        $httpBackend = _$httpBackend_;
        mailService = _mailService_;
        vncConstant = _vncConstant_;
        makeController = () => {
            return new SidebarController( $scope, $state, $rootScope, auth, mailService, sidebarService, routerHelper,
                                         vncConstant );
        };
        // configure routes in provider
        routerHelper.configureStates(mockData.getMockStates());
    }));

    describe('Module', () => {
        // top-level specs: i.e., routes, injection, naming
      before(function() {
        module = angular.module("sidebar");
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
      });

      it('should get folderMenu and tagMenu', () => {
        let controller = makeController();
        $httpBackend.whenGET(/.*/).respond('');
        $httpBackend.flush();
        expect(controller.folderMenu).to.not.be.empty.object;
        expect(controller.tagMenu).to.not.be.empty.object;
      });

      describe('Sidebar API request', () => {

        // controller specs
        it('Should get Tags from API', () => {
          let controller = makeController();
          $httpBackend.flush();
          expect(controller.tags).to.have.length('0');
          controller.getTagList();
          $httpBackend.expectGET($rootScope.API_URL + '/getTagList', {"Accept":"application/json","Content-Type":"application/json","Authorization":"undefined"}, {}).respond(mockData.getMockTagList());
          $httpBackend.flush();
          expect(controller.tags).to.have.length.above('0');
        });

        it("should update tags when tag-added", function() {
          let controller = makeController();
          $httpBackend.flush();
          $rootScope.$broadcast('tag-added');
          $httpBackend.expectGET($rootScope.API_URL + '/getTagList', {"Accept":"application/json","Content-Type":"application/json","Authorization":"undefined"}, {}).respond(mockData.getMockTagList());
          $httpBackend.flush();
          expect(controller.tags).to.have.length.above('0');
        });

        it("should update vm.change when get folder", function() {
          let controller = makeController();
          $rootScope.$broadcast('get folder');
          controller.change = true;
          expect(controller.change).to.have.equal(true);
        });

        it('should get navigation routes', () => {
          let controller = makeController();
          controller.getNavRoutes();
          expect(controller.navRoutes).to.have.length('2');
        });

        it('check isSelectingRoute state', () => {
          let controller = makeController();
          expect(controller.isSelectingRoute(controller.navRoutes[0])).to.have.equal('current');
        });

        it('check is parent state', () => {
          let controller = makeController();
          expect(controller.filterParentState({ name: controller.$state.current.name })).to.have.equal(true);
          expect(controller.filterParentState({ name: 'fake.name' + controller.$state.current.name })).to.have.equal(false);
        });
      });
    });

    describe('Component', () => {
        // component/directive specs
        let component = SidebarComponent();

        it('includes the intended template',() => {
            expect(component.template).to.equal(SidebarTemplate);
        });

        it('uses `controllerAs` syntax', () => {
            expect(component).to.have.property('controllerAs');
        });

        it('uses `restrict` syntax', () => {
          expect(component).to.have.property('restrict');
        });

        it('invokes the right controller', () => {
            expect(component.controller).to.equal(SidebarController);
        });
    });
});
