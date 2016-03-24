import angular from 'angular'
import MailModule from '../mail'
import MailListModule from './mail.list'
import CoreModule from '../../../common/core/core'
import MailListController from './mail.list.controller';
import MailListComponent from './mail.list.component';
import MailListTemplate from './mail.list.html';
import MockData from '../../../../test-helpers/mock-data';
import mailComposeTemplate from '../mail.compose/mail.compose.html';
import uiBootstrapModal from '../../../common/modal/ui.bootstrap.modal/ui.bootstrap.modal.es6';

describe('MailList', () => {
    let $rootScope, $scope, $uibModal, auth, AUTH_EVENTS, config, logger, mailFilterByDateService, mailHandleService,
      mailService, moment, vncConstant, $timeout, makeController, $filter, $state, routerHelper, $httpBackend,
      totalUnreadEmailMockData, unReadMockData, module, $compile;

    beforeEach(window.module( MailModule.name, MailListModule.name, CoreModule.name, uiBootstrapModal.name));
    beforeEach(inject((_$rootScope_, _$uibModal_, _auth_, _config_, _logger_,  _AUTH_EVENTS_,  _mailFilterByDateService_, _mailHandleService_,
                       _mailService_, _moment_, _vncConstant_, _$timeout_, _$filter_, _$state_, _routerHelper_ , _$httpBackend_, _$compile_) => {
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
      $uibModal = _$uibModal_;
      auth = _auth_;
      config = _config_;
      logger = _logger_;
      AUTH_EVENTS = _AUTH_EVENTS_;
      mailFilterByDateService = _mailFilterByDateService_;
      mailHandleService = _mailHandleService_;
      mailService = _mailService_;
      moment = _moment_;
      $timeout = _$timeout_;
      $filter = _$filter_;
      $state = _$state_;
      routerHelper = _routerHelper_;
      $httpBackend = _$httpBackend_;
      vncConstant = _vncConstant_;
      $compile = _$compile_;
      makeController = () => {
        return new MailListController( $scope, $timeout, $uibModal, auth, AUTH_EVENTS, config, logger, mailFilterByDateService, mailHandleService,
          mailService, moment, vncConstant, $rootScope, $compile );
      };
    }));

    describe('Module', () => {
      //top-level specs: i.e., routes, injection, naming
      before(function() {
        module = angular.module("mail.list");
      });

      it("should be registered", function() {
        expect(module).not.to.equal(null);
      });
    });

  describe('Controller', () => {
    beforeEach(function() {
      $httpBackend.whenGET(/.*/).respond('');
      $httpBackend.whenPOST(/.*/).respond('');
      $httpBackend.flush();
    });

    before(function() {
      totalUnreadEmailMockData = MockData.getTotalUnreadEmailMockData();
      unReadMockData = MockData.emailDetailMockData();
    });

    // controller specs
    it('Ctrl should be defined', () => {
      let controller = makeController();
      expect(controller).to.be.defined;
      expect(controller.request.offset).to.be.equal(0);
      expect(controller.isBusy).to.be.true;
      expect(controller.scope).to.be.equal($scope);
      expect(controller.auth).to.be.equal(auth);
      expect(controller.mailService).to.be.equal(mailService);
      expect(controller.logger).to.be.equal(logger);
      expect(controller.timeout).to.be.equal($timeout);
      expect(controller.moment).to.be.equal(moment);
      expect(controller.vncConstant).to.be.equal(vncConstant);
      expect(controller.mailFilterByDateService).to.be.equal(mailFilterByDateService);
      expect(controller.mailHandleService).to.be.equal(mailHandleService);
      expect(controller.mailComposeTemplate).to.be.equal(mailComposeTemplate);
    });

    it('should get all unread mails', () => {
      let controller = makeController();
      $httpBackend.expectPOST($rootScope.API_URL + '/searchRequest').respond([{$:{class: "PUB",
        cm: "1",
        compNum: "0",
        d: "1449606082000",
        f: "!",
        id: "9121",
        invId: "9121-9120",
        isOrg: "1",
        l: "15",
        loc: "adfadfa",
        md: "1449606082",
        ms: "21044",
        name: "Test",
        percentComplete: "0",
        priority: "1",
        ptst: "AC",
        rev: "21044",
        s: "0",
        sf: "0",
        status: "NEED",
        t: "",
        tn: "",
        uid: "ada781bf-1c9c-4b34-a6d1-dcc8ffd831dd",
        x_uid: "ada781bf-1c9c-4b34-a6d1-dcc8ffd831dd"},inst: ""}, {$:{class: "PUB",
        cm: "1",
        compNum: "0",
        d: "1443447845000",
        f: "",
        id: "5432",
        invId: "5432-5647",
        isOrg: "1",
        l: "15",
        loc: "21",
        md: "1443447845",
        ms: "5193",
        name: "task no 21",
        percentComplete: "0",
        priority: "5",
        ptst: "AC",
        rev: "5193",
        s: "0",
        sf: "0",
        status: "NEED",
        t: "",
        tn: "",
        uid: "e49c6800-b06e-4876-a7a0-fda09492ad75",
        x_uid: "e49c6800-b06e-4876-a7a0-fda09492ad75"},fr: "212121212121212121",
        inst: "",
        or:{$:{a: "dhavaly@zuxfdev.vnc.biz",
        url: "dhavaly@zuxfdev.vnc.biz"}}}]);
    });

    it('check email object ', () => {
      let controller = makeController();
      expect(controller.request).to.be.an('object').and.have.property('types', 'conversation');
      expect(controller.request).to.have.property('sortBy', 'dateDesc');
      expect(controller.email).to.be.an('object').and.have.property('infiniteScrollDisabled', false);
    });

    it("check searchOptions object and it's properties", () => {
      let controller = makeController();
      expect(controller.searchOptions).to.be.an('object').and.have.property('show', false);
      expect(controller.searchOptions).to.have.property('size', 'sm');
      expect(controller.searchOptions).to.have.property('items');
      expect(controller.searchOptions.items).to.be.an('array').and.have.length(12);
    });

    it('check searchOptions properties object', () => {
      let controller = makeController();
      $rootScope.$broadcast('search', 'huy');
      expect(controller.email.search).to.be.equal('huy');
      expect(controller.request.query).to.be.an('array').and.have.length.of.at.least(1);
    });

  });


  describe('Component', () => {
        // component/directive specs
        let component = MailListComponent();

        it('includes the intended template',() => {
            expect(component.template).to.equal(MailListTemplate);
        });

        it('uses `controllerAs` syntax', () => {
            expect(component).to.have.property('controllerAs');
        });

        it('invokes the right controller', () => {
            expect(component.controller).to.equal(MailListController);
        });
    });
});
