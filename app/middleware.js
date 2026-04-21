const path = require("path");
module.exports = (app) => {
  //配置静态根目录
  const koaStatic = require("koa-static");
  app.use(koaStatic(path.resolve(process.cwd(), "./app/public")));

  //模板渲染引擎
  const koaNunjucks = require("koa-nunjucks-2");
  app.use(
    koaNunjucks({
      ext: "tpl",
      path: path.resolve(process.cwd(), "./app/public"),
      nunjucksConfig: {
        trimBlocks: true,
        noCache: true,
      },
    }),
  );

  //引入 ctx.body 解析中间件
  const bodyParser = require("koa-bodyparser");
  app.use(
    bodyParser({
      enableTypes: ["json", "form", "text"],
      formLimit: "1000mb",
    }),
  );

  //错误处理中间件
  app.use(app.middlewares.errorHandler);

  //校验签名中间件
  app.use(app.middlewares.apiSignVerify);
};
