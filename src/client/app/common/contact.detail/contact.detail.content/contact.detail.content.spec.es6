import ContactDetailModule from '../contact.detail'
import ContactDetailContentController from './contact.detail.content.controller';
import ContactDetailContentComponent from './contact.detail.content.component';
import ContactDetailContentTemplate from './contact.detail.content.html';

describe('ContactDetail', () => {
  let $rootScope, $scope, module, makeController, makeIsolateScope, makeElement;

  beforeEach(window.module(ContactDetailModule.name));
  beforeEach(inject((_$rootScope_) => {
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    makeController = () => {
      return new ContactDetailContentController( $scope );
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
    let component = ContactDetailContentComponent();

    it('includes the intended template',() => {
      expect(component.template).to.equal(ContactDetailContentTemplate);
    });

    it('uses `controllerAs` syntax', () => {
      expect(component).to.have.property('controllerAs');
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(ContactDetailContentController);
    });
  });
});
