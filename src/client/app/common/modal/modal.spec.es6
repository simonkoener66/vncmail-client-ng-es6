import ModalModule from './modal'
import ModalController from './modal.controller';
import ModalComponent from './modal.component';
import ModalTemplate from './modal.html';

describe('Modal', () => {
    let $rootScope, $uibModal, module, makeController, makeIsolateScope;

    beforeEach(window.module(ModalModule.name));
    beforeEach(inject((_$rootScope_, _$uibModal_, _$compile_) => {
        $rootScope = _$rootScope_;
        $uibModal = _$uibModal_;
        makeController = () => {
            return new ModalController( $uibModal );
        };
        makeIsolateScope = () => {
          let element = angular.element(`<vnc-modal template="abc.html" use_ctrl="abcCtrl" size="sm" backdrop="true" resolve="{name: 'modal'}"> My Modal </vnc-modal>`);
          _$compile_(element)($rootScope);
          return element.isolateScope();
        };

    }));

    describe('Module', () => {
        // top-level specs: i.e., routes, injection, naming
      before(function() {
        module = angular.module("modal");
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
        it('should be created isolate scope successfully', () => {
          let element = makeIsolateScope();
          expect(element.vm.template).to.equal('abc.html');
          expect(element.vm.useCtrl).to.equal('abcCtrl');
          expect(element.vm.size).to.equal('sm');
          expect(element.vm.backdrop).to.be.boolean;
          expect(element.vm.resolve).to.be.object;
        });
    });

    describe('Component', () => {
        // component/directive specs
        let component = ModalComponent();

        it('includes the intended template',() => {
            expect(component.template).to.equal(ModalTemplate);
        });

        it('uses `controllerAs` syntax', () => {
            expect(component).to.have.property('controllerAs');
        });

        it('invokes the right controller', () => {
            expect(component.controller).to.equal(ModalController);
        });
    });
});
