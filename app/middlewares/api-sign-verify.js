const md5 = require("md5");
module.exports = (app) => {
  return async (ctx, next) => {
    if (ctx.path.indexOf("/api") < 0) {
      return await next();
    }

    const { path, method } = ctx;
    const { headers } = ctx.request;
    const { s_sign: sSign, s_t: st } = headers;
    const signKey = app.options.apiSignKey;
    const signature = md5(`${signKey}_${st}`);

    app.logger.info(`[${method} ${path}]  signature: ${signature}`);
    if (
      !sSign ||
      !st ||
      signature !== sSign.toLowercase() ||
      Date.now() - st > 1000 * 60 * 5
    ) {
      ctx.status = 200;
      ctx.body = {
        success: false,
        message: "签名错误",
        code: 445,
      };
      return;
    }
    await next();
  };
};
