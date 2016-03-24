import core from './core';
import coreConfig from './core.config';

describe('Core', () => {
  let $rootScope, vncConstant, module, auth, config;

  beforeEach(window.module(core.name));
  beforeEach(inject((_$rootScope_, _vncConstant_, _config_) => {
    $rootScope = _$rootScope_;
    config = _config_;
    vncConstant = _vncConstant_;
  }));

  describe('Module', () => {
    //top-level specs: i.e., routes, injection, naming
    before(function() {
      module = angular.module("core");
    });

    it("fileUpload module should be registered", function() {
      expect(module).to.not.equal(null);
    });
  });

  describe('Core Config', function() {
    it("config variables should be defined", function() {
      expect(config.appTitle).to.equal('vncuxf');
      expect(config.appErrorPrefix).to.equal('[vncuxf Error] ');
      expect(config.ENVIRONMENT).to.be.ok;
      expect(config.SITE_WS).to.be.ok;
      expect(config.SITE_URL).to.be.ok;
    });
    it("vncConstant should match value types", function() {
      expect(vncConstant).to.be.an('object');
      expect(vncConstant).to.be.defined;
      expect(vncConstant.FOLDERID).to.be.an('object');
      expect(vncConstant.SEARCH_CRITERIA).to.be.an('object');
      expect(vncConstant.APPOINTMENT_VERBS).to.be.an('object');
      expect(vncConstant.COLOR_CODES).to.be.an('array').to.have.length(10);
    });
  });
});
