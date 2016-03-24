import ContactDetailModule from './contact.detail'
import ContactDetailController from './contact.detail.controller';
import ContactDetailComponent from './contact.detail.component';

describe('ContactDetail', () => {
  let $rootScope, $scope, $compile, module, makeController, makeIsolateScope, makeElement;

  beforeEach(window.module(ContactDetailModule.name));
  beforeEach(inject((_$rootScope_, _$compile_) => {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    makeController = () => {
      return new ContactDetailController( $compile );
    };
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
    before(function() {
      module = angular.module("ContactDetail");
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
    let component = ContactDetailComponent();

    it('uses `controllerAs` syntax', () => {
      expect(component).to.have.property('controllerAs');
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(ContactDetailController);
    });
  });
});
