import MailModule from '../mail'
import MailJunkModule from './mail.junk'
import CoreModule from '../../../common/core/core'
import MailJunkController from './mail.junk.controller';
import MailJunkComponent from './mail.junk.component';
import MailJunkTemplate from './mail.junk.html';
import MockData from '../../../../test-helpers/mock-data';

describe('MailJunk', () => {
  let $rootScope, auth, routerHelper, $state, vncConstant, makeController, module;

  beforeEach(window.module( MailModule.name, MailJunkModule.name, CoreModule.name));
  beforeEach(inject((_$rootScope_, _auth_, _vncConstant_, _routerHelper_, _$state_) => {
    $rootScope = _$rootScope_;
    auth = _auth_;
    vncConstant = _vncConstant_;
    routerHelper = _routerHelper_;
    $state = _$state_;
    makeController = () => {
      return new MailJunkController( vncConstant, auth );
    };
    // configure routes in provider
    let states = MockData.getMockStates();
    let temp = states.map(function(x){return x.state});
    states.splice(temp.indexOf('mail'));
    states.splice(temp.indexOf('mail.junk'));
    routerHelper.configureStates(states);
  }));

  describe('Module', () => {
    //top-level specs: i.e., routes, injection, naming
    before(function() {
      module = angular.module("mail.junk");
    });

    it("should be registered", function() {
      expect(module).not.to.equal(null);
    });
    describe('state', () => {

      it('should map state junk to url /junk ', () => {
        expect($state.href('mail.junk', {})).to.equal('/mail/junk');
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
      expect(controller.mail.queryBy).to.be.equal(vncConstant.SEARCH_CRITERIA.IN_JUNK);
    });

  });

  describe('Component', () => {
    // component/directive specs
    let component = MailJunkComponent();

    it('includes the intended template',() => {
      expect(component.template).to.equal(MailJunkTemplate);
    });

    it('uses `controllerAs` syntax', () => {
      expect(component).to.have.property('controllerAs');
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(MailJunkController);
    });
  });
});
