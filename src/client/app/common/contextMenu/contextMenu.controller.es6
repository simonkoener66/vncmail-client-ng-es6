class ContextMenuController {
  /* @ngInject */
  constructor($compile, logger) {
    this.compile = $compile;
    this.logger = logger;
  }
}

export default ContextMenuController;
