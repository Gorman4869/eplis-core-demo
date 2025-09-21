module.exports = (app) =>
  class BaseController {
    /**
     * controller 基类
     * 统一收拢contoller 相关公共方法
     *
     */
    constructor() {
      this.app = app;
      this.config = app.config;
      //   this.service = app.service;
    }

    /**
     * API 处理成功是统一返回结构
     * @param {object} ctx 上下文
     * @param {object} data 核心数据
     * @param {object} metadata 附加数据
     */
    success(ctx, data = {}, metadata = {}) {
      ctx.status = 200;
      ctx.body = {
        success: true,
        data,
        metadata: {},
      };
    }

    /**
     * API 处理失败是统一返回结构
     * @param {object} ctx 上下文
     * @param {string} message 错误信息
     * @param {number} code 错误编码
     */
    success(ctx, message, code) {
      ctx.body = {
        success: false,
        message,
        code,
      };
    }
  };
