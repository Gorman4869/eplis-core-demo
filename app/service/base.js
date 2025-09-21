const superagent = require("superagent");
module.exports = (app) =>
  class BaseService {
    /**
     * service 基类
     */
    constructor(ctx) {
      this.app = app.app;
      this.config = app.config;
      this.curl = superagent;
    }
  };
