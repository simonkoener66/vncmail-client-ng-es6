import FileRepeatModule from './file.repeat'
import FileRepeatController from './file.repeat.controller';
import FileRepeatComponent from './file.repeat.component';
import FileRepeatTemplate from './file.repeat.html';
import CoreModule from '../../core/core';

describe('FileUpload', () => {
  let $rootScope, logger, module, makeController;

  beforeEach(window.module(FileRepeatModule.name, CoreModule.name));
  beforeEach(inject((_$rootScope_, _logger_) => {
    $rootScope = _$rootScope_;
    logger = _logger_;
    makeController = () => {
      return new FileRepeatController( logger );
    };
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
    before(function() {
      module = angular.module("fileRepeat");
    });

    it("fileUpload module should be registered", function() {
      expect(module).to.not.equal(null);
    });
  });

  describe('Controller', () => {
    // controller specs
    it('should be created successfully', () => {
      let controller = makeController();
      expect(controller).to.be.defined;
    });

    it('files should be an undefined', () => {
      let controller = makeController();
      expect(controller.files).to.be.an('array').with.length(0);
    });

    it('files should be remove', () => {
      let controller = makeController();
      controller.files = [{name: 'file1'}, {name: 'file2'}, {name: 'file3'}];
      expect(controller.files).to.be.an('array').with.length(3);
      controller.removeFile(2, controller.files[2]);      // file should remove of index 2
      expect(controller.files).to.be.an('array').with.length(2);
    });

  });

  describe('Component', () => {
      // component/directive specs
      let component = FileRepeatComponent();

      it('includes the intended template',() => {
        expect(component.template).to.equal(FileRepeatTemplate);
      });

      it('uses `controllerAs` syntax', () => {
        expect(component).to.have.property('controllerAs', 'vm');
      });

      it('uses `restrict` syntax', () => {
        expect(component.restrict).to.be.equal('E');
      });

      it('uses `bindToController` syntax', () => {
        expect(component).to.have.property('bindToController', true);
      });

      it('invokes the right controller', () => {
        expect(component.controller).to.equal(FileRepeatController);
      });
  });
});
