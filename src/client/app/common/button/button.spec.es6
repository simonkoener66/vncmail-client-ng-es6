import ButtonModule from './button'
import ButtonController from './button.controller';
import ButtonComponent from './button.component';
import ButtonTemplate from './button.html';

describe('Button', () => {
    let $rootScope, module, makeController, makeIsolateScope;

    beforeEach(window.module( ButtonModule.name));
    beforeEach(inject((_$rootScope_, _$compile_) => {
        $rootScope = _$rootScope_;
        makeController = () => {
            return new ButtonController( );
        };
        makeIsolateScope  = () => {
          let element = angular.element('<vnc-button href="dummy.com" button-size="sm"></vnc-button>');
          _$compile_(element)($rootScope);
          return element.isolateScope();
        }
    }));

    describe('Module', () => {
      //top-level specs: i.e., routes, injection, naming
      before(function() {
        module = angular.module("button");
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
            controller.size = '';
            expect(controller.applySize()).to.equal('button-md');
            controller.size = 'sm';
            expect(controller.applySize()).to.equal('button-sm');
        });
        it('is anchor', () => {
            let attr = {href: 'dummy.html'};
            let controller = makeController();
            expect(controller.isAnchor(attr)).to.be.true;
        });
    });

    describe('Component', () => {
        // component/directive specs
        let component = ButtonComponent();

        it('includes the intended template',() => {
            expect(component.template(false, false)).to.equal(ButtonTemplate);
        });

        it('uses `controllerAs` syntax', () => {
            expect(component).to.have.property('controllerAs');
        });

        it('invokes the right controller', () => {
            expect(component.controller).to.equal(ButtonController);
        });

        it('check button size', () => {
          let element = makeIsolateScope();
          expect(element.vm.size).to.be.defined;
        });

    });
});
