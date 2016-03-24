import TasksModule from './tasks'
import TasksController from './tasks.controller';
import TasksComponent from './tasks.component';
import TasksTemplate from './tasks.html';

describe('Tasks', () => {
    let $rootScope, logger, $state, makeController;

    beforeEach(window.module( TasksModule.name));
    beforeEach(inject((_$rootScope_, _logger_, _$state_) => {
        $rootScope = _$rootScope_;
        logger = _logger_;
        $state = _$state_;
        makeController = () => {
            return new TasksController( logger );
        };
    }));

    describe('Module', () => {
        //top-level specs: i.e., routes, injection, naming
        describe('state', () => {

            it('should map state tasks to url /tasks ', function() {
                expect($state.href('tasks', {})).to.equal('/tasks');
            });
        });
    });

    describe('Controller', () => {
        // controller specs
        it('Ctrl should be defined', () => {
            let controller = makeController();
            expect(controller).to.be.defined;
        });
        it('has a title property', () => {
            let controller = makeController();
            expect(controller.title).to.equal('Tasks');
        });
    });

    describe('Component', () => {
        // component/directive specs
        let component = TasksComponent();

        it('includes the intended template',() => {
            expect(component.template).to.equal(TasksTemplate);
        });

        it('uses `controllerAs` syntax', () => {
            expect(component).to.have.property('controllerAs');
        });

        it('invokes the right controller', () => {
            expect(component.controller).to.equal(TasksController);
        });
    });
});
