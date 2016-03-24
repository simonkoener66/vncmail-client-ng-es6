import TasksModule from '../tasks'
import tasksTasksModule from '../tasks.tasks/tasks.tasks'
import TaskComposeController from './task.compose.controller.es6';
import taskComposeTemplate from './task.compose.html'
import CoreModule from '../../../common/core/core';
import UiBootstrapModule from '../../../common/modal/ui.bootstrap.modal/ui.bootstrap.modal';
import mockData from '../../../../test-helpers/mock-data';

describe('TaskCompose', () => {
  let $rootScope, $scope, logger, $modalInstance, $state, $uibModal, data, routerHelper,
    mailService, auth, moment, $sce, vncConstant, makeController, $httpBackend, handleTaskService, $stateParams;

  beforeEach(window.module( TasksModule.name, tasksTasksModule.name, CoreModule.name, UiBootstrapModule.name));
  beforeEach(inject((_$rootScope_, _logger_, _$modal_, _$sce_, _mailService_, _$uibModal_, _auth_, _$state_,
                     _moment_, _vncConstant_, _$httpBackend_, _handleTaskService_, _$stateParams_, _routerHelper_) => {
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    logger = _logger_;
    mailService = _mailService_;
    $httpBackend = _$httpBackend_;
    auth = _auth_;
    $uibModal = _$uibModal_;
    moment = _moment_;
    vncConstant = _vncConstant_;
    $sce = _$sce_;
    data = {"operation":"compose"};
    $state = _$state_;
    $stateParams = _$stateParams_;
    handleTaskService = _handleTaskService_;
    routerHelper = _routerHelper_;
    $modalInstance = _$modal_.open({
      templateUrl: taskComposeTemplate
    });
    makeController = () => {
      return new TaskComposeController(logger, $modalInstance, mailService, $state, moment, $uibModal, $rootScope, $scope, data, handleTaskService, $stateParams);
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
      it('has a controller property', () => {
        let controller = new makeController();
        expect(controller).to.be.defined;
      });

      it('has a keyPress functionality', () => {
        let controller = new makeController();
        controller.keypressbackground();
        expect(controller.keyPress).to.be.true;
      });


      it('has a priority functionality', () => {
        let controller = new makeController();
        controller.OnPriorityClick(0);        // 0->High 1->Normal 2->Low
        expect(controller.selectedPriority.type).to.equal('High');
      });

      it('has a status functionality', () => {
        let controller = new makeController();
        controller.OnStatusClick(0);        // 0->Not Started 1->Completed 2->In Progress 3->Waiting on someone else 4->Deferred 5->All
        expect(controller.selectedStatus.type).to.equal('Not Started');
      });

      it('has a progress functionality', () => {
        let controller = new makeController();
        controller.OnProgressClick(0);        // 0->0%, 1->10%, 2->20%, 3->30%, 4->40%, 5->50%, 6->60%, 7->70%, 8->80%, 9->90%, 10->100%
        expect(controller.selectedProgress.type).to.equal('100%');
      });

      it('creates new task', () => {
        let controller = makeController();
        let getMockData = mockData.createTask();
        controller.compCreateTask.push(getMockData[0]);
        controller.createNewTask();
        $httpBackend.when('POST',$rootScope.API_URL + '/createTask')
           .respond({
               "success": true
           });
        expect(controller.compCreateTask).to.be.an('array');
        expect(controller.compCreateTask).to.have.length(1);
      });

      it('check modifyTask function', () => {
        let controller = makeController();
        let getModifyTaskMockData = mockData.getModifyTaskMockData();
        let spy = sinon.spy($modalInstance, 'dismiss');
        controller.modifyTask();
        $httpBackend.expectPOST($rootScope.API_URL + '/modifyTask').respond(getModifyTaskMockData);
        $httpBackend.flush();
        expect(spy).to.be.called;
      })
  });

});
