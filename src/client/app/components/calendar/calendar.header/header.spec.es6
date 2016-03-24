import HeaderModule from './header';
import HeaderController from './header.controller';
import HeaderComponent from './header.component';
import HeaderTemplate from './header.html';

describe('Calendar', () => {
  let $state, calendarService, makeController;

  beforeEach(window.module( HeaderModule.name ));
  beforeEach(inject((_$state_, _calendarService_) => {
    $state = _$state_;
    calendarService = _calendarService_;
    makeController = () => {
      return new HeaderController( $state, calendarService );
    };
    // configure routes in provider
//    let states = MockData.getMockStates();
//    let temp = states.map((x) => {
//      return x.state;
//    });
//    states.splice(temp.indexOf('calendar'));
//    routerHelper.configureStates(states);
  }));

  let calendarHeaderModule;

  describe('Module', () => {
     //top-level specs: i.e., routes, injection, naming
    before(function() {
      calendarHeaderModule = angular.module('calendar.header');
    });

    it('should be registered', () => {
      expect(calendarHeaderModule).not.to.equal(null);
    });
//      describe('state', () => {
//
//          it('should map state calendar to url /calendar ', () => {
//              expect($state.href('calendar', {})).to.equal('/calendar');
//          });
//      });
  });

  describe('Controller', () => {
    // controller specs
    it('Ctrl should be defined', () => {
        let controller = makeController();
      expect(controller).to.be.defined;
    });
//    it('has a title property', () => {
//        let controller = makeController();
//      expect(controller.title).to.equal('Calendar');
//    });
    it('properties should defined', () => {
      let controller = makeController();
      expect(controller.service).to.equal(calendarService);
    });
  });

  describe('Component', () => {
      // component/directive specs
      let component = HeaderComponent();

      it('includes the intended template',() => {
        expect(component.template).to.equal(HeaderTemplate);
      });

      it('uses `controllerAs` syntax', () => {
        expect(component).to.have.property('controllerAs');
      });

      it('invokes the right controller', () => {
        expect(component.controller).to.equal(HeaderController);
      });
  });
});
