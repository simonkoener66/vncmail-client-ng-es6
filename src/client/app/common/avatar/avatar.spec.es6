import AvatarModule from './avatar'
import AvatarController from './avatar.controller';
import AvatarComponent from './avatar.component';
import AvatarTemplate from './avatar.html';
import CoreModule from '../core/core';

describe('Avatar', () => {
    let $rootScope, config, module, makeController, makeIsolateScope;

    beforeEach(window.module( AvatarModule.name, CoreModule.name));
    beforeEach(inject((_$rootScope_, _config_, _$compile_) => {
        $rootScope = _$rootScope_;
        config = _config_;
        makeController = () => {
            return new AvatarController( config );
        };
        makeIsolateScope  = () => {
          let element = angular.element('<vnc-avatar person-name="HH"></vnc-avatar>');
          _$compile_(element)($rootScope);
          return element.isolateScope();
        };
    }));

    describe('Module', () => {
        //top-level specs: i.e., routes, injection, naming
      before(function() {
        module = angular.module("avatar");
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
        });
        it('applySize should return size', () => {
            let controller = makeController();
            controller.size = 'sm';
            expect(controller.applySize()).to.equal('avatar-sm');
        });
        it('size is empty applySize should return default', () => {
          let controller = makeController();
          controller.size = '';
          expect(controller.applySize()).to.equal('avatar-md');
        });
        it('name should be split', () => {
          let element = makeIsolateScope();
          expect(element.vm.name).to.be.equal('HH');
          expect(element.vm.shortName).to.be.equal('H');
        });
    });

    describe('Component', () => {
        // component/directive specs
        let component = AvatarComponent();

        it('includes the intended template',() => {
            expect(component.template).to.equal(AvatarTemplate);
        });

        it('uses `controllerAs` syntax', () => {
            expect(component).to.have.property('controllerAs');
        });

        it('invokes the right controller', () => {
            expect(component.controller).to.equal(AvatarController);
        });
    });
});
