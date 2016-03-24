import MailModule from '../mail'
import MailDraftModule from './mail.draft'
import CoreModule from '../../../common/core/core.module.es6'
import MailDraftController from './mail.draft.controller';
import MailDraftComponent from './mail.draft.component';
import MailDraftTemplate from './mail.draft.html';
import MockData from '../../../../test-helpers/mock-data';

describe('MailDraft', () => {
    let $rootScope, auth, routerHelper, $state, vncConstant, makeController, module;

  beforeEach(window.module( MailModule.name, MailDraftModule.name, CoreModule.name));
  beforeEach(inject((_$rootScope_, _auth_, _vncConstant_, _routerHelper_, _$state_) => {
    $rootScope = _$rootScope_;
    auth = _auth_;
    vncConstant = _vncConstant_;
    routerHelper = _routerHelper_;
    $state = _$state_;
    makeController = () => {
      return new MailDraftController( vncConstant, auth );
    };
    // configure routes in provider
    let states = MockData.getMockStates();
    let temp = states.map(function(x){return x.state});
    states.splice(temp.indexOf('mail'));
    states.splice(temp.indexOf('mail.draft'));
    routerHelper.configureStates(states);
  }));

    describe('Module', () => {
        //top-level specs: i.e., routes, injection, naming
      before(function() {
        module = angular.module("mail.draft");
      });

      it("should be registered", function() {
        expect(module).not.to.equal(null);
      });
      describe('state', () => {

        it('should map state draft to url /draft ', () => {
          expect($state.href('mail.draft', {})).to.equal('/mail/draft');
        });
      });
    });

  describe('Controller', () => {
    // controller specs
    it('Ctrl should be defined', () => {
      let controller = makeController();
      expect(controller).to.be.defined;
    });

    it('Mail object should be defined', () => {
      let controller = makeController();
      expect(controller.mail).to.be.defined;
      expect(controller.mail.showBy).to.be.equal('receiver');
      expect(controller.mail.queryBy).to.be.equal(vncConstant.SEARCH_CRITERIA.IN_DRAFTS);
    });

  });

    describe('Component', () => {
        // component/directive specs
        let component = MailDraftComponent();

        it('includes the intended template',() => {
            expect(component.template).to.equal(MailDraftTemplate);
        });

        it('uses `controllerAs` syntax', () => {
            expect(component).to.have.property('controllerAs');
        });

        it('invokes the right controller', () => {
            expect(component.controller).to.equal(MailDraftController);
        });
    });
});
