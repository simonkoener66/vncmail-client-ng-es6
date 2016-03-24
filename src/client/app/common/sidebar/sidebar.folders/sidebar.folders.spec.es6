import SidebarFoldersModule from './sidebar.folders'
import SidebarFoldersController from './sidebar.folders.controller';
import SidebarFoldersComponent from './sidebar.folders.component';
import SidebarFoldersTemplate from './sidebar.folders.html';
import CoreModule from '../../core/core';

describe('Sidebar', () => {
    let $rootScope, $scope, vncConstant, mailService, makeController;

    beforeEach(window.module(SidebarFoldersModule.name, CoreModule.name));
    beforeEach(inject((_$rootScope_, _vncConstant_, _mailService_) => {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        vncConstant = _vncConstant_;
        mailService = _mailService_;
        makeController = () => {
            return new SidebarFoldersController( mailService, $scope, vncConstant, $rootScope );
        };
    }));

    describe('Module', () => {
        // top-level specs: i.e., routes, injection, naming
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
        let component = SidebarFoldersComponent();

        it('includes the intended template',() => {
            expect(component.template).to.equal(SidebarFoldersTemplate);
        });

        it('uses `controllerAs` syntax', () => {
            expect(component).to.have.property('controllerAs');
        });

        it('invokes the right controller', () => {
            expect(component.controller).to.equal(SidebarFoldersController);
        });
    });
});
