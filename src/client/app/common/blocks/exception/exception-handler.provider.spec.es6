import BlockModule from '../block.module';
import ExceptionModule from './exception.module';

describe('blocks.exception', () => {
    let exceptionHandlerProvider, $rootScope;
    var mocks = {
        errorMessage: 'fake error',
        prefix: '[TEST]: '
    };

    beforeEach(window.module(BlockModule.name, ExceptionModule.name));
    beforeEach(inject((_$rootScope_, _exceptionHandler_) => {
        exceptionHandlerProvider = _exceptionHandler_;
        $rootScope = _$rootScope_;
    }));

    describe('exceptionHandlerProvider', () => {
        it('should have a dummy test', () => {
            expect(true).to.equal(true);
        });

        it('should have exceptionHandlerProvider defined', () => {
            expect(exceptionHandlerProvider).to.be.defined;
        });

        it('should have configuration',() => {
            expect(exceptionHandlerProvider.config).to.be.defined;
        });

        it('should have configuration', () => {
            expect(exceptionHandlerProvider.configure).to.be.defined;
        });

        describe('with appErrorPrefix',() => {
            beforeEach(() => {
                exceptionHandlerProvider.configure(mocks.prefix);
            });

            //it('should have appErrorPrefix defined',() => {
            //    expect(exceptionHandlerProvider.$get().config.appErrorPrefix).to.be.defined;
            //});
            //
            //it('should have appErrorPrefix set properly',() => {
            //    expect(exceptionHandlerProvider.$get().config.appErrorPrefix)
            //        .to.equal(mocks.prefix);
            //});
            //
            //it('should throw an error when forced', () => {
            //    expect(functionThatWillThrow).to.throw();
            //});
            //
            //it('manual error is handled by decorator', () => {
            //    var exception;
            //    exceptionHandlerProvider.configure(mocks.prefix);
            //    try {
            //        $rootScope.$apply(functionThatWillThrow);
            //    }
            //    catch (ex) {
            //        exception = ex;
            //        expect(ex.message).to.equal(mocks.prefix + mocks.errorMessage);
            //    }
            //});
        });
    });

    function functionThatWillThrow() {
        throw new Error(mocks.errorMessage);
    }
});
