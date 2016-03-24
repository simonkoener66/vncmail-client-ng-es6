import PreferencesModule from './preferences'
import PreferencesController from './preferences.controller';
import PreferencesComponent from './preferences.component';
import PreferencesTemplate from './preferences.html';
import ImportTemplate from './preferences.import/preferences.import.html';
describe('Preferences', () => {
  let logger, $state, auth, makeController;

  beforeEach(window.module( PreferencesModule.name));
  beforeEach(inject((_logger_, _$state_, _auth_) => {
    logger = _logger_;
    $state = _$state_;
    auth = _auth_;
    makeController = () => {
      return new PreferencesController( logger, auth );
    };
  }));

  describe('Module', () => {
    //top-level specs: i.e., routes, injection, naming
    describe('state', () => {

      it('should map state preferences to url /preferences', function() {
        expect($state.href('preferences', {})).to.equal('/preferences');
      });
    });
  });

  describe('Controller', () => {
    // controller specs
    it('Ctrl should be defined', () => {
      let controller = makeController();
      expect(controller).to.be.defined;
      expect(controller.importTemplate).to.be.equal(ImportTemplate);
    });
    it('has a title property', () => {
      let controller = makeController();
      expect(controller.title).to.equal('Preferences');
    });
  });

  describe('Component', () => {
    // component/directive specs
    let component = PreferencesComponent();

    it('includes the intended template',() => {
      expect(component.template).to.equal(PreferencesTemplate);
    });

    it('uses `controllerAs` syntax', () => {
      expect(component).to.have.property('controllerAs');
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(PreferencesController);
    });
  });
});
