import TagModule from './tag'
import TagController from './tag.controller';
import TagComponent from './tag.component';
import TagTemplate from './tag.html';
import CoreModule from '../core/core';

describe('Tag', () => {
    let $rootScope, scope, module, vncConstant, makeController, makeIsolateScope;

    beforeEach(window.module(TagModule.name, CoreModule.name));
    beforeEach(inject((_$rootScope_, _vncConstant_, _$compile_) => {
        $rootScope = _$rootScope_;
        vncConstant = _vncConstant_;
        makeController = () => {
            return new TagController( vncConstant );
        };
        makeIsolateScope  = () => {
          let element = angular.element('<vnc-tag tag-name="green" tag-color="1"></vnc-tag>');
          _$compile_(element)($rootScope);
          return element.isolateScope();
        }
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
        // controller specs
        it('should be created successfully', () => {
            let controller = makeController();
            expect(controller).to.be.defined;
        });
        it('should be defined', () => {
            let controller = makeController();
            expect(controller.name).to.be.defined;
            expect(controller.tagClass).to.be.defined;
        });
        it('should be defined', () => {
            let element = makeIsolateScope();
            expect(element.vm.tagClass).to.be.equal('blue');
        });
    });

  describe('Component', () => {
        // component/directive specs
        let component = TagComponent();

        it('includes the intended template',() => {
            expect(component.template).to.equal(TagTemplate);
        });

        it('uses `controllerAs` syntax', () => {
            expect(component).to.have.property('controllerAs');
        });

        it('invokes the right controller', () => {
            expect(component.controller).to.equal(TagController);
        });
    });
});
