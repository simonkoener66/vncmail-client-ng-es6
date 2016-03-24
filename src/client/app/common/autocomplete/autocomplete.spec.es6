import AutocompleteModule from './autocomplete'
import AutocompleteController from './autocomplete.controller';
import AutocompleteComponent from './autocomplete.component';
import AutocompleteTemplate from './autocomplete.html';
import CoreModule from '../core/core';
import mockData from '../../../test-helpers/mock-data';


describe('Autocomplete', () => {
    let $rootScope, $timeout, mailService, makeController, autoCompleteMockData, routerHelper, module, $compile, $httpBackend;

    beforeEach(window.module( AutocompleteModule.name, CoreModule.name));
    beforeEach(inject((_$rootScope_, _$timeout_, _mailService_, _$compile_, _$httpBackend_, _routerHelper_) => {
        $rootScope = _$rootScope_;
        $timeout =_$timeout_;
        mailService =_mailService_;
        $compile =_$compile_;
        $httpBackend = _$httpBackend_;
        routerHelper = _routerHelper_;
        makeController = () => {
            return new AutocompleteController( $timeout, mailService );
        };
        // configure routes in provider
        routerHelper.configureStates(mockData.getMockStates());
    }));

    describe('Module', () => {
        //top-level specs: i.e., routes, injection, naming
        before(function() {
          module = angular.module("autoComplete");
        });

        it("autoComplete module should be registered", function() {
          expect(module).to.not.equal(null);
        });

        it("autoComplete module should be equal to AutocompleteModule", function() {
          expect(module).to.be.equal(AutocompleteModule);
        });
    });

    describe('Controller', () => {
      before(() => {
        autoCompleteMockData = mockData.getAutoCompleteMockData();
      });
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

        it('Email Suggestion should be defined', () => {
            let controller = makeController();
            controller.loadEmailSuggestion('huy');
            $httpBackend.expectPOST($rootScope.API_URL + '/autocomplete').respond(autoCompleteMockData[0]);
            $httpBackend.flush();
            expect(controller.request).to.be.define;
            expect(controller.request).to.be.an('object').and.have.property('name', 'huy');
            expect(controller.request).to.be.an('object').and.have.property('name', 'huy');
        });

        it('Should generate tag list', () => {
          let controller = makeController();
          expect(controller.generateTagList(autoCompleteMockData[0].$)).to.be.deep.equal(
            {
              display: 'Mac Anh. Huy <macanh.huy@vnc.biz>',
              name: 'Mac Anh. Huy',
              email: 'macanh.huy@vnc.biz'
            }
          );
        });

    });

    describe('Component', () => {
        // component/directive specs
        let component = AutocompleteComponent();

        it('includes the intended template',() => {
            expect(component.template).to.equal(AutocompleteTemplate);
        });

        it('invokes the right controller', () => {
            expect(component.controller).to.equal(AutocompleteController);
        });

        it('uses `controllerAs` syntax and equal to vm', () => {
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
          expect(component.scope).to.have.property('placeholder');
        });
    });
});
