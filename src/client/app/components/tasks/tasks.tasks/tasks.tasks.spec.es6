
import TasksModule from '../tasks.tasks/tasks.tasks'
import TasksController from './tasks.tasks.controller.es6';
import TasksTemplate from './tasks.tasks.html';
import CoreModule from '../../../common/core/core';
import mockData from '../../../../test-helpers/mock-data';

describe('Tasks', () => {
  let  logger, auth, rootScope, scope, AUTH_EVENTS, config, mailService, makeController, moment, routerHelper, $httpBackend, $timeout, $state, handleTaskService, $stateParams;

  beforeEach(window.module(TasksModule.name, CoreModule.name));
  beforeEach(inject((_logger_,_config_,_$rootScope_,_auth_,_mailService_,_moment_,_$httpBackend_, _AUTH_EVENTS_, _routerHelper_, _$timeout_, _$state_, _$stateParams_,_handleTaskService_) => {
    rootScope= _$rootScope_;
    scope= rootScope.$new();
    moment=_moment_;
    config=_config_;
    logger = _logger_;
    AUTH_EVENTS = _AUTH_EVENTS_;
    mailService = _mailService_;
    routerHelper = _routerHelper_;
    auth = _auth_;
    $httpBackend = _$httpBackend_;
    $timeout = _$timeout_;
    $state = _$state_;
    $stateParams = _$stateParams_;
    handleTaskService = _handleTaskService_;
    makeController = () => {
      return new TasksController(logger, auth, $state, scope, AUTH_EVENTS, config, mailService, moment, rootScope, handleTaskService, $stateParams, $timeout);
    };
    // configure routes in provider
    let states = mockData.getMockStates();
    let temp = states.map(function(x){return x.state});
    states.splice(temp.indexOf('tasks'));
    routerHelper.configureStates(states);
  }));

  describe('Controller', () => {
    beforeEach(function() {
      $httpBackend.whenGET(/.*/).respond('');
      $httpBackend.whenPOST(/.*/).respond('');
      $httpBackend.flush();
    });
    // controller specs
    //  it('get task list', () => {
    //    let controller = makeController();
    //    expect(controller).to.be.defined;
    //    //controller.getTasklistFromService();
    //    let request={
    //      limit:100
    //    };
    //    $httpBackend.expectPOST(rootScope.API_URL + '/searchRequest').respond(request);
    //    $httpBackend.flush();
    //    //expect(controller.response).to.be.an('array');
    //});
    it('has a controller property', () => {
      let controller = makeController();
      expect(controller).to.be.defined;
    });

    it('check the operation', () => {
      let controller = makeController();
      let markAsComplete =  mockData.getMarkAsCompleted();
      expect(markAsComplete[0].operation).to.equal("markAsCompleted");
    });
  });
});
