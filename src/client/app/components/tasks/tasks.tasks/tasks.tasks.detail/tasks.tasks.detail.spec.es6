import uiRouter from 'angular-ui-router';
import TasksModule from '../../tasks'
import tasksTasksModule from '../../tasks.tasks/tasks.tasks'
import tasksDetailModule from './tasks.tasks.detail';
import TaskDetailController from './tasks.tasks.detail.controller';
import tasksDetailComponent from './tasks.tasks.detail.component.es6';
import CoreModule from '../../../../common/core/core';
import mockData from '../../../../../test-helpers/mock-data';


describe('TaskDetail', () => {
  let $rootScope, $scope, $state, module, logger, $sce, makeController, $stateParams, $window, mailService, moment, handleTaskService;

  beforeEach(window.module( tasksDetailModule.name, CoreModule.name, uiRouter ));
  beforeEach(inject((_$rootScope_, _$state_, _logger_, _$sce_, _$compile_, _$stateParams_, _$window_, _mailService_, _moment_, _handleTaskService_) => {
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $state = _$state_;
    logger = _logger_;
    $sce = _$sce_;
    $stateParams = _$stateParams_;
    $window = _$window_;
    moment = _moment_;
    mailService = _mailService_;
    handleTaskService = _handleTaskService_;
    makeController = () => {
      return new TaskDetailController( $stateParams, $window, $state, mailService, moment );
    };
  }));

  describe('Controller', () => {
    // controller specs
    it('Ctrl should be defined', () => {
     let controller = makeController();
     expect(controller).to.be.defined;
    });

    it('taskDetail should be defined', () => {
     let controller = makeController();
     let getMockData = mockData.getTaskDetail();
     controller.taskDetails = getMockData[0].m;
     controller.handleTaskDetail( getMockData[0].m );
     expect(controller.subject).to.be.equal(getMockData[0].m.inv.comp.$.name);
    });

    it('taskDetail location should be defined', () => {
      let controller = makeController();
      let getMockData = mockData.getTaskDetail();
      controller.taskDetails = getMockData[0].m;
      controller.handleTaskDetail( getMockData[0].m );
      expect(controller.location).to.be.equal(getMockData[0].m.inv.comp.$.loc);
    });

    it('taskDetail progress should be defined', () => {
      let controller = makeController();
      let getMockData = mockData.getTaskDetail();
      controller.taskDetails = getMockData[0].m;
      controller.handleTaskDetail( getMockData[0].m );
      expect(controller.progress).to.be.equal(getMockData[0].m.inv.comp.$.percentComplete);
    });
  });

  describe('Component', () => {
    // component/directive specs
    let component = tasksDetailComponent();

    it('uses `bindToController` syntax', () => {
      expect(component).to.have.property('bindToController', true);
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(TaskDetailController);
    });
  });
  });
