import MailModule from '../mail'
import MailTrashModule from './mail.trash'
import CoreModule from '../../../common/core/core'
import MailTrashController from './mail.trash.controller';
import MailTrashComponent from './mail.trash.component';
import MailTrashTemplate from './mail.trash.html';
import MockData from '../../../../test-helpers/mock-data';

describe('MailTrash', () => {
  let $rootScope, auth, routerHelper, $state, vncConstant, makeController, module;

  beforeEach(window.module( MailModule.name, MailTrashModule.name, CoreModule.name));
  beforeEach(inject((_$rootScope_, _auth_, _vncConstant_, _routerHelper_, _$state_) => {
    $rootScope = _$rootScope_;
    auth = _auth_;
    vncConstant = _vncConstant_;
    routerHelper = _routerHelper_;
    $state = _$state_;
    makeController = () => {
      return new MailTrashController( vncConstant, auth );
    };
    // configure routes in provider
    let states = MockData.getMockStates();
    let temp = states.map(function(x){return x.state});
    states.splice(temp.indexOf('mail'));
    states.splice(temp.indexOf('mail.trash'));
    routerHelper.configureStates(states);
  }));

  describe('Module', () => {
    //top-level specs: i.e., routes, injection, naming
    before(function() {
      module = angular.module("mail.trash");
    });

    it("should be registered", function() {
      expect(module).not.to.equal(null);
    });
    describe('state', () => {

      it('should map state trash to url /trash ', () => {
        expect($state.href('mail.trash', {})).to.equal('/mail/trash');
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
      expect(controller.mail.showBy).to.be.equal('sender');
      expect(controller.mail.queryBy).to.be.equal(vncConstant.SEARCH_CRITERIA.IN_TRASH);
    });

  });

  describe('Component', () => {
    // component/directive specs
    let component = MailTrashComponent();

    it('includes the intended template',() => {
      expect(component.template).to.equal(MailTrashTemplate);
    });

    it('uses `controllerAs` syntax', () => {
      expect(component).to.have.property('controllerAs');
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(MailTrashController);
    });
  });
});
