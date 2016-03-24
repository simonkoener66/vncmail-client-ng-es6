import ContactsModule from './contacts'
import ContactsController from './contacts.controller';
import ContactsComponent from './contacts.component';
import ContactsTemplate from './contacts.html';

describe('Contacts', () => {
    let $rootScope, logger, $state, module, makeController;

    beforeEach(window.module( ContactsModule.name));
    beforeEach(inject((_$rootScope_, _logger_, _$state_) => {
        $rootScope = _$rootScope_;
        logger = _logger_;
        $state = _$state_;
        makeController = () => {
            return new ContactsController( logger );
        };
    }));

    describe('Module', () => {
      //top-level specs: i.e., routes, injection, naming
      before(function() {
        module = angular.module("contacts");
      });

      it("should be registered", function() {
        expect(module).not.to.equal(null);
      });
      describe('state', () => {

        it('should map state contacts to url /contacts ', () => {
          expect($state.href('contacts', {})).to.equal('/contacts');
        });
      });
    });

    describe('Controller', () => {
        // controller specs
        it('Ctrl should be defined', () => {
            let controller = makeController();
            expect(controller).to.be.defined;
            expect(controller.logger).to.be.equal(logger);
        });

    });

    describe('Component', () => {
        // component/directive specs
        let component = ContactsComponent();

        it('includes the intended template',() => {
            expect(component.template).to.equal(ContactsTemplate);
        });

        it('uses `controllerAs` syntax', () => {
            expect(component).to.have.property('controllerAs');
        });

        it('invokes the right controller', () => {
            expect(component.controller).to.equal(ContactsController);
        });
    });
});
