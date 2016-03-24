import MenuModule from './menu'
import MenuController from './menu.controller';
import MenuComponent from './menu.component';

describe('Menu', () => {
  let $rootScope, $compile, module, makeController, makeIsolateScope, makeElement;

  beforeEach(window.module(MenuModule.name));
  beforeEach(inject((_$rootScope_, _$compile_) => {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    makeController = () => {
      return new MenuController( $compile );
    };
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
    before(function() {
      module = angular.module("menu");
    });

    it("should be registered", function() {
      expect(module).not.to.equal(null);
    });
  });

  describe('Controller', () => {
    // controller specs
    it('Ctrl should be defined', () => {
      let controller = makeController();
      expect(controller).to.be.defined;
    });
  });

  describe('Component', () => {
      // component/directive specs
      let component = MenuComponent();

      it('uses `controllerAs` syntax', () => {
        expect(component).to.have.property('controllerAs');
      });

      it('invokes the right controller', () => {
        expect(component.controller).to.equal(MenuController);
      });
  });
});
