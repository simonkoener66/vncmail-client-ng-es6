import RichTextboxModule from './richTextbox'
import RichTextboxController from './richTextbox.controller';
import RichTextboxComponent from './richTextbox.component';
import RichTextboxTemplate from './richTextbox.html';
import 'angular-ui-tinymce/src/tinymce.js';

describe('RichTextbox', () => {
    let $rootScope, module, makeController, makeIsolateScope;

    beforeEach(window.module(RichTextboxModule.name, 'ui.tinymce'));
    beforeEach(inject((_$rootScope_, _$compile_) => {
        $rootScope = _$rootScope_;
        makeController = () => {
            return new RichTextboxController();
        };
        makeIsolateScope = () => {
          $rootScope.content = [];
          let element = angular.element('<vnc-rich-textbox textarea-required="true" textarea-options="{}" ng-model="$rootScope.content"></vnc-rich-textbox>');
          _$compile_(element)($rootScope);
          return element.isolateScope();
        };
    }));

    describe('Module', () => {
        // top-level specs: i.e., routes, injection, naming
      before(function() {
        module = angular.module("richTextbox");
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
          let controller = makeIsolateScope();
          expect(controller.vm.textareaRequired).to.be.equal('true');
          expect(controller.vm.textareaOptions).to.be.equal('{}');
        });
    });

    describe('Component', () => {
        // component/directive specs
        let component = RichTextboxComponent();

        it('includes the intended template',() => {
            expect(component.template).to.equal(RichTextboxTemplate);
        });

        it('uses `controllerAs` syntax', () => {
            expect(component).to.have.property('controllerAs');
        });

        it('invokes the right controller', () => {
            expect(component.controller).to.equal(RichTextboxController);
        });
    });
});
