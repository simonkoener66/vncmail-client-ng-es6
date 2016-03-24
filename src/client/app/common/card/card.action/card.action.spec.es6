import CardActionModule from './card.action'
import CardActionComponent from './card.action.component';

describe('CardAction', () => {
    let $rootScope, config;

    beforeEach(window.module( CardActionModule.name));
    beforeEach(inject((_$rootScope_) => {
        $rootScope = _$rootScope_;
    }));

    describe('Module', () => {
        //top-level specs: i.e., routes, injection, naming
      before(function() {
        module = angular.module("cardAction");
      });

      it("should be registered", function() {
        expect(module).not.to.equal(null);
      });

      it("should be equal to CardActionModule", function() {
        expect(module).to.equal(CardActionModule);
      });

    });

    describe('Component', () => {
        // component/directive specs
        let component = CardActionComponent();

        it('includes the intended template',() => {
            expect(component.template).to.equal('<div class="actions text-right" ng-transclude></div>');
        });

        it('should have restrict property and equal to E',() => {
            expect(component).to.have.property('restrict', 'E')
        });

        it('should have transclude property and equal to true',() => {
            expect(component).to.have.property('transclude', true)
        });

    });
});
