import ContactsModule from '../contacts.es6';
import ContactComposeController from './contact.compose.controller';
import ContactComposeTemplate from './contact.compose.html';
import UiBootstrapModule from '../../../common/modal/ui.bootstrap.modal/ui.bootstrap.modal';
import CoreModule from '../../../common/core/core';
import mockData from '../../../../test-helpers/mock-data';

describe('Contact Compose', () => {
  let logger, $modalInstance, $stateParams, module, $state, mailService, makeController, $httpBackend, $rootScope, config, data, routerHelper, getavtarUploadMockData, getInitializeModifyFormMockData, getCreateNewContactMockData, getModifyContactMockData;
  beforeEach(window.module( ContactsModule.name, UiBootstrapModule.name ));
  beforeEach(inject((_logger_, _$state_, _mailService_, _$modal_, _config_, _$httpBackend_, _$rootScope_, _routerHelper_) => {
    $modalInstance = _$modal_.open({ template: ContactComposeTemplate });
    $rootScope = _$rootScope_;
    logger = _logger_;
    config = _config_;
    routerHelper = _routerHelper_;
    data = {operation:'compose'};
    $stateParams = {contactId: 8712};
    $state = _$state_;
    mailService = _mailService_;
    $httpBackend = _$httpBackend_;
    makeController = () => {
      return new ContactComposeController( logger, $modalInstance, mailService, config, $state, data, $stateParams );
    };

    // configure routes in provider
    let states = mockData.getMockStates();
    let temp = states.map(function(x){return x.state});
    states.splice(temp.indexOf('contacts'));
    routerHelper.configureStates(states);
  }));

  describe('Module', () => {
    //top-level specs: i.e., routes, injection, naming
    before(function() {
      module = angular.module("contacts");
    });

    it("should be registered", function() {
      expect(module).not.to.equal(null);
    });

  });

  describe('Controller', () => {
    // controller specs

    before(function() {
      getavtarUploadMockData = mockData.getAvtarUploadMockData();
      getInitializeModifyFormMockData = mockData.getInitializeModifyFormMockData();
      getCreateNewContactMockData = mockData.getCreateNewContactMockData();
      getModifyContactMockData = mockData.getModifyContactMockData();
    });

    beforeEach(function() {
      $httpBackend.whenGET(/.*/).respond('');
      $httpBackend.whenPOST(/.*/).respond('');
      $httpBackend.flush();
    });

    it('Ctrl should be defined', () => {
      let controller = makeController();
      expect(controller).to.be.defined;
      expect(controller.mailService).to.be.defined;
      expect(controller.logger).to.be.defined;
    });

  it('upperLayout to be an object and have property `prefix` `suffix`', () => {
      let controller = makeController();
      expect(controller.upperLayout).to.be.an('object');
      expect(controller.upperLayout).to.have.property('prefix', false);
      expect(controller.upperLayout).to.have.property('suffix', false);
      expect(controller.upperLayout).to.have.property('maiden', false);
      expect(controller.upperLayout).to.have.property('middle', false);
      expect(controller.upperLayout).to.have.property('department', false);
      expect(controller.upperLayout).to.have.property('nickname', false);
    });

    it('createContactRequest to be an object and have property `contactAttrs`', () => {
      let controller = makeController();
      expect(controller.createContactRequest).to.be.an('object');
      expect(controller.createContactRequest).to.have.property('contactAttrs');
    });

    it('createContactRequest.contactAttrs to be an array', () => {
      let controller = makeController();
      expect(controller.createContactRequest.contactAttrs).to.be.an('array').and.empty;
    });

    it('saveContactDetail to be an object', () => {
      let controller = makeController();
      expect(controller.saveContactDetail).to.be.an('object');
    });

    it("check saveContactDetail's property and property type ", () => {
      let controller = makeController();
      expect(controller.saveContactDetail).to.have.property('email').to.be.an('object');
      expect(controller.saveContactDetail).to.have.property('url').to.be.an('array');
      expect(controller.saveContactDetail).to.have.property('phone').to.be.an('array');
      expect(controller.saveContactDetail).to.have.property('address').to.be.an('array');
      expect(controller.saveContactDetail).to.have.property('screen').to.be.an('array');
      expect(controller.saveContactDetail).to.have.property('others').to.be.an('array');
    });

    it('check $modalInstance dismiss to be called', () => {
      let controller = makeController();
      let spy = sinon.spy($modalInstance, 'dismiss');
      controller.cancel();
      expect(spy).to.be.called;
    });

    it('changeUpperLayout function to be called and add keys in saveContactDetail object', () => {
      let controller = makeController();
      controller.upperLayout.prefix = true;
      controller.upperLayout.suffix = true;
      controller.upperLayout.maiden = true;
      controller.upperLayout.middle = true;
      controller.upperLayout.department = true;
      controller.upperLayout.nickname = true;

      controller.changeUpperLayout('prefix');
      expect(controller.upperLayout.prefix).to.be.false;
      expect(controller.saveContactDetail).to.have.property('prefix').to.be.defined;

      controller.changeUpperLayout('suffix');
      expect(controller.upperLayout.suffix).to.be.false;
      expect(controller.saveContactDetail).to.have.property('suffix').to.be.defined;

      controller.changeUpperLayout('maiden');
      expect(controller.upperLayout.maiden).to.be.false;
      expect(controller.saveContactDetail).to.have.property('maiden').to.be.defined;

      controller.changeUpperLayout('middle');
      expect(controller.upperLayout.middle).to.be.false;
      expect(controller.saveContactDetail).to.have.property('middle').to.be.defined;

      controller.changeUpperLayout('department');
      expect(controller.upperLayout.department).to.be.false;
      expect(controller.saveContactDetail).to.have.property('department').to.be.defined;

      controller.changeUpperLayout('nickname');
      expect(controller.upperLayout.nickname).to.be.false;
      expect(controller.saveContactDetail).to.have.property('nickname').to.be.defined;

    });

    it("when handleCreateContactRequest to be called update createContactRequest.contactAttrs's array ", () => {
      let controller = makeController();
      controller.handleCreateContactRequest();
      expect(controller.createContactRequest.contactAttrs).to.have.length.above(5);
    });

    //it("getNextAddressIndex to be called ", () => {
    //  let controller = makeController();
    //  controller.changeADDRESSType(0, 'mobile');
    //});

    it("when removeUrl to be called active equal to false and value equal empty_string", () => {
      let controller = makeController();
      controller.removeUrl(0);
      expect(controller.saveContactDetail.url[0]).to.have.property('active', false);
      expect(controller.saveContactDetail.url[0]).to.have.property('value', '')
    });

    it("when removeOthers to be called active equal to false and value equal empty_string ", () => {
      let controller = makeController();
      controller.removeOthers(0);
      expect(controller.saveContactDetail.others[0]).to.have.property('active', false);
      expect(controller.saveContactDetail.others[0]).to.have.property('value', '')
    });

    it("when addEmail to be called ", () => {
      let controller = makeController();
      controller.addEmail();
      expect(controller.saveContactDetail.email).to.have.property(2);
      expect(controller.saveContactDetail.email[2]).to.be.an('object');
      expect(controller.saveContactDetail.email[2]).to.have.property('active', true)
    });

    it("when removeEmail to be called active equal to false and value equal empty_string ", () => {
      let controller = makeController();
      controller.removeEmail(1);
      expect(controller.saveContactDetail.email[1]).to.have.property('active', false);
      expect(controller.saveContactDetail.email[1]).to.have.property('value', '')
    });

    it("when removePhone to be called active equal to false and value equal empty_string ", () => {
      let controller = makeController();
      controller.removePhone(0);
      expect(controller.saveContactDetail.phone[0]).to.have.property('active', false);
      expect(controller.saveContactDetail.phone[0]).to.have.property('value', '')
    });

    it("when addScreen to be called new object to be added in saveContactDetail.screen", () => {
      let controller = makeController();
      controller.addAddress(0);
      expect(controller.saveContactDetail.address).to.have.length.above(1);
    });

    it("when removeAddress to be called active equal to false and value equal empty_string ", () => {
      let controller = makeController();
      controller.removeAddress(0);
      expect(controller.saveContactDetail.address[0]).to.have.property('active', false);
      expect(controller.saveContactDetail.address[0]).to.have.property('state', '')
    });

    it("when addScreen to be called new object to be added in saveContactDetail.screen", () => {
      let controller = makeController();
      controller.addScreen(0);
      expect(controller.saveContactDetail.screen).to.have.length.above(1);
    });

    it("when removeScreen to be called active equal to false and value equal empty_string ", () => {
      let controller = makeController();
      controller.removeScreen(0);
      expect(controller.saveContactDetail.screen[0]).to.have.property('active', false);
      expect(controller.saveContactDetail.screen[0]).to.have.property('value', '')
    });

    it("check avtarUpload to be called and upload image successfully", () => {
      let controller = makeController();
      let files = getavtarUploadMockData[0];
      controller.avtarUpload();
      controller.forOnChange(files);
      $httpBackend.expectPOST($rootScope.API_URL + '/uploadAvatar').respond(getavtarUploadMockData[1]);
      $httpBackend.flush();
      expect(controller.imgURL).to.be.equal(getavtarUploadMockData[2]);
      expect(controller.createContactRequest.contactAttrs).to.be.an('array').and.have.length(1);
    });

    it("check initializeModifyForm function", () => {
      let controller = makeController();
      //let files = getavtarUploadMockData[0];
      controller.initializeModifyForm();

      expect($stateParams.contactId).to.be.defined;
      expect(controller.saveContactDetail).to.be.an('object').and.have.property('email');
      expect(controller.saveContactDetail.email).to.have.property("1");
      expect(controller.saveContactDetail).to.have.property("url").to.be.an('array').and.empty;
      expect(controller.saveContactDetail).to.have.property("phone").to.be.an('array').and.empty;
      expect(controller.saveContactDetail).to.have.property("address").to.be.an('array').and.empty;
      expect(controller.saveContactDetail).to.have.property("screen").to.be.an('array').and.empty;
      expect(controller.saveContactDetail).to.have.property("others").to.be.an('array').and.empty;
      $httpBackend.expectPOST($rootScope.API_URL + '/getItem').respond(getInitializeModifyFormMockData);
      $httpBackend.flush();
      expect(controller.saveContactDetail.screen).to.have.length(3);
      expect(controller.saveContactDetail.screen[0].isSaved).to.be.true;
      expect(controller.saveContactDetail.screen[0].active).to.be.true;
      expect(controller.saveContactDetail.screen[0].type).to.be.equal('sdfdsa');
      expect(controller.saveContactDetail.screen[0].value).to.be.equal('undefined');
      expect(controller.saveContactDetail.email).to.have.property('1').to.have.property('key', 'email');
      expect(controller.saveContactDetail.email[1]).to.have.property('value', 'test@vnc.biz');
      expect(controller.saveContactDetail.url).to.be.an('array').and.have.length(1);
      expect(controller.saveContactDetail.phone).to.be.an('array').and.have.length(1);
      expect(controller.saveContactDetail.address).to.be.an('array').and.have.length(1);
      expect(controller.saveContactDetail.others).to.be.an('array').and.have.length(1);

    });

    it('check createNewContact function', () => {
      let controller = makeController();
      let spy = sinon.spy($modalInstance, 'dismiss');
      controller.createNewContact();
      $httpBackend.expectPOST($rootScope.API_URL + '/createContact').respond(getCreateNewContactMockData);
      $httpBackend.flush();
      expect(spy).to.be.called;
    });

    it('check modifyContact function', () => {
      let controller = makeController();
      let spy = sinon.spy(controller, 'cancel');
      controller.modifyContact();
      $httpBackend.expectPOST($rootScope.API_URL + '/modifyContact').respond(getModifyContactMockData);
      $httpBackend.flush();
      expect(spy).to.be.called;
    })

  });

});
