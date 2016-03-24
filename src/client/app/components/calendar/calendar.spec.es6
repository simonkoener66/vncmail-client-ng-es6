import CalendarModule from './calendar';
import CalendarController from './calendar.controller';
import CalendarComponent from './calendar.component';
import CalendarTemplate from './calendar.html';
import CoreModule from '../../common/core/core';
import MockData from '../../../test-helpers/mock-data';

describe('Calendar', () => {
  let $rootScope, logger, $state, module, calendarService, routerHelper, makeController;

  beforeEach(window.module( CalendarModule.name, CoreModule.name ));
  beforeEach(inject((_$rootScope_, _logger_, _$state_, _calendarService_, _routerHelper_) => {
    $rootScope = _$rootScope_;
    logger = _logger_;
    $state = _$state_;
    calendarService = _calendarService_;
    routerHelper = _routerHelper_;
    makeController = () => {
      return new CalendarController( $state, calendarService, logger );
    };
    // configure routes in provider
    let states = MockData.getMockStates();
    let temp = states.map((x) => {
      return x.state;
    });
    states.splice(temp.indexOf('calendar'));
    routerHelper.configureStates(states);
  }));

  describe('Module', () => {
     //top-level specs: i.e., routes, injection, naming
    before(function() {
      module = angular.module('calendar');
    });

    it('should be registered', () => {
      expect(module).not.to.equal(null);
    });
      describe('state', () => {

          it('should map state calendar to url /calendar ', () => {
              expect($state.href('calendar', {})).to.equal('/calendar');
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
      expect(controller.title).to.equal('Calendar');
    });
    it('properties should defined', () => {
      let controller = makeController();
      expect(controller.service).to.equal(calendarService);
    });
  });

  describe('Component', () => {
      // component/directive specs
      let component = CalendarComponent();

      it('includes the intended template',() => {
        expect(component.template).to.equal(CalendarTemplate);
      });

      it('uses `controllerAs` syntax', () => {
        expect(component).to.have.property('controllerAs');
      });

      it('invokes the right controller', () => {
        expect(component.controller).to.equal(CalendarController);
      });
  });
});
