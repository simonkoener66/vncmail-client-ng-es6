import ResizeHeaderModule from './resizeHeader'
import ResizeHeaderComponent from './resizeHeader.component';
import CoreModule from '../core/core';

describe('ResizeHeader', () => {
    let $rootScope, module, $timeout, mailService, makeElement, makeIsolateScope;

    beforeEach(window.module( ResizeHeaderModule.name, CoreModule.name));
    beforeEach(inject((_$rootScope_, _$timeout_, _mailService_, _$compile_) => {
        $rootScope = _$rootScope_;
        $timeout =_$timeout_;
        mailService =_mailService_;
        makeIsolateScope = () => {
          let element = angular.element('<vnc-resize-header height-space="110"></vnc-resize-header>');
          _$compile_(element)($rootScope);
          return element.isolateScope();
        };
        makeElement = () => {
          let element = angular.element('<vnc-resize-header height-space="110"></vnc-resize-header>');
          _$compile_(element)($rootScope);
          return element;
        };
    }));

    describe('Module', () => {
        //top-level specs: i.e., routes, injection, naming
      before(function() {
        module = angular.module("resizeHeader");
      });

      it("should be registered", function() {
        expect(module).not.to.equal(null);
      });
    });

    describe('Link', () => {
      // Link specs
      it('should be defined', () => {
        let element = makeIsolateScope();
        expect(element.heightSpace).to.equal('110');
      });

      it('should set height on resize', () => {
        let element = makeElement();
        let scope = makeIsolateScope();
        angular.element(window).trigger('resize');
        expect(element).to.have.css('height', (angular.element(window).innerHeight() - scope.heightSpace + 'px'));
      });
    });

});
