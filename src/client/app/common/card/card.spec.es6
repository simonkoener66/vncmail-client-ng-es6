import CardModule from './card'
import CardComponent from './card.component';
import CardTemplate from './card.html';

describe('Card', () => {

    beforeEach(window.module( CardModule.name));

    describe('Module', () => {
        //top-level specs: i.e., routes, injection, naming
      before(function() {
        module = angular.module("vncCard");
      });

      it("Card module should be registered", function() {
        expect(module).to.not.equal(null);
      });

      it("should be equal to CardModule", function() {
        expect(module).to.equal(CardModule);
      });
    });

    describe('Component', () => {
        // component/directive specs
        let component = CardComponent();

        it('includes the intended template',() => {
            expect(component.template).to.equal(CardTemplate);
        });

        it('uses `controllerAs` syntax', () => {
            expect(component).to.have.property('controllerAs', 'vm');
        });

        it('uses `bindToController` syntax', () => {
            expect(component).to.have.property('bindToController', true);
        });

        it('uses `transclude` and equal to true', () => {
          expect(component).to.have.property('transclude', true);
        });

        it('uses `restrict` and equal to E', () => {
          expect(component).to.have.property('restrict', 'E');
        });

        it('scope should be define and not empty', () => {
            expect(component.scope).to.be.define;
            expect(component.scope).to.not.empty;
        });

    });
});
