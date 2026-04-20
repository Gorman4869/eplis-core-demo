module.exports = (app) => {
  // console.log("Custom Middleware Loaded");
  return async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      //异常处理
      const { status, message, detail } = err;

      app.logger.info(JSON.stringify(err));
      app.logger.error("[-- exception --]:", err);
      app.logger.error("[-- exception --]:", status, message, detail);
      if (message && message.indexOf("template not found") > -1) {
        //页面重定向
        ctx.status = 302; //临时重定向
        ctx.redirect(`${app.options?.homePage}`);
        return;
      }

      const resBody = {
        success: false,
        code: 90000,
        message: "网络异常 请稍重试",
      };
      ctx.body = resBody;
      ctx.status = 200;
    }
  };
};
