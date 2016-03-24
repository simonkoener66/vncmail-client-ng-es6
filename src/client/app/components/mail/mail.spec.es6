import MailModule from './mail'
import MailController from './mail.controller';
import MailComponent from './mail.component';
import MailTemplate from './mail.html';
describe('Mail', () => {
    let $rootScope, logger, $state, makeController;

    beforeEach(window.module( MailModule.name));
    beforeEach(inject((_$rootScope_, _logger_, _$state_) => {
        $rootScope = _$rootScope_;
        logger = _logger_;
        $state = _$state_;
        makeController = () => {
            return new MailController( logger );
        };
    }));

    describe('Module', () => {
        //top-level specs: i.e., routes, injection, naming
        describe('state', () => {

            it('should map state mail to url /mail ', function() {
                expect($state.href('mail', {})).to.equal('/mail');
            });
        });
    });

    describe('Controller', () => {
        // controller specs
        it('Ctrl should be defined', () => {
            let controller = makeController();
            expect(controller).to.be.defined;
        });
        it('has a title property', () => {
            let controller = makeController();
            expect(controller.title).to.equal('Mail');
        });
    });

    describe('Component', () => {
        // component/directive specs
        let component = MailComponent();

        it('includes the intended template',() => {
            expect(component.template).to.equal(MailTemplate);
        });

        it('uses `controllerAs` syntax', () => {
            expect(component).to.have.property('controllerAs');
        });

        it('invokes the right controller', () => {
            expect(component.controller).to.equal(MailController);
        });
    });
});
