// Include in index.html so that app level exceptions are handled.
// Exclude from testRunner.html which should run exactly what it wants to run
let exceptionHandlerProvider = function () {
    /* jshint validthis:true */
    this.config = {
        appErrorPrefix: undefined
    };

    this.configure = function (appErrorPrefix) {
      /* @ngInject */
        this.config.appErrorPrefix = appErrorPrefix;
    };

    this.$get = exceptionHandler;

    function exceptionHandler() {
        return {config: this.config};
    }
};

export default exceptionHandlerProvider;
