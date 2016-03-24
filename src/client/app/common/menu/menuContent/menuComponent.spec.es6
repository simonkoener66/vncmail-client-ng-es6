import MenuModule from '../menu'
import MenuContentController from './menuContent.controller';
import MenuContentComponent from './menuContent.component';
import MenuContentTemplate from './menuContent.html';

describe('MenuContent', () => {
  let $rootScope, $scope, $sce, module, makeController, makeIsolateScope, makeElement;

  beforeEach(window.module(MenuModule.name));
  beforeEach(inject((_$rootScope_, _$sce_) => {
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $sce = _$sce_;
    makeController = () => {
      return new MenuContentController( $sce, $scope );
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

    it('applySize should return size', () => {
      let controller = makeController();
      controller.size = 'sm';
      expect(controller.applySize()).to.equal('menu-sm');
    });
    it('null value applySize should return default', () => {
      let controller = makeController();
      controller.size = '';
      expect(controller.applySize()).to.equal('menu-md');
    });
  });

  describe('Component', () => {
    // component/directive specs
    let component = MenuContentComponent();

    it('includes the intended template',() => {
      expect(component.template).to.equal(MenuContentTemplate);
    });

    it('uses `controllerAs` syntax', () => {
      expect(component).to.have.property('controllerAs');
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(MenuContentController);
    });
  });
});
