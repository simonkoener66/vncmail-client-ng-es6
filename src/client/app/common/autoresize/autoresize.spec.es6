import AutoResizeModule from './autoresize'
import AutoResizeComponent from './autoresize.component';
import CoreModule from '../core/core';

describe('AutoResize', () => {
  let module, makeElement, $rootScope;

  beforeEach(window.module(AutoResizeModule.name, CoreModule.name));
  beforeEach(inject((_$compile_, _$rootScope_) => {
    $rootScope = _$rootScope_;
    makeElement = () => {
      let element = angular.element('<textarea vnc-auto-resize style="height: 0"></textarea>');
      _$compile_(element)($rootScope);
      return element;
    };
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
    before(function() {
      module = angular.module("autoResize");
    });

    it("AutoResize module should be registered", function() {
      expect(module).to.not.equal(null);
    });

  });

  describe('Component', () => {
      // component/directive specs
      let component = AutoResizeComponent();

      it('includes the intended template',() => {
        expect(component.restrict).to.equal('A');
      });

      it('link function should be defined', () => {
        expect(component.link).to.be.a('function');
      });

  });

  describe('Link', () => {
    // Link specs
    it('height should be define and enable', () => {
      let element = makeElement();
      expect(element).to.have.css('height');
      expect(element).to.be.enabled;
    });
    it('height element[0].scrollHeight', () => {
      let element = makeElement();
      element.trigger('keyup');
      expect(element).to.have.css('height', element[0].scrollHeight+'px');
    });
  });
});
