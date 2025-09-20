const glob = require("glob");
const path = require("path");
const { sep } = path;
const KoaRouter = require("koa-router");

/**
 * router loader
 * @param {object} app
 * 解析所有app/router目录下的文件，并加载到KoaRouter实例中
 */
module.exports = (app) => {
  // 找到路由文件路径
  const routerPath = path.resolve(app.businessPath, `.${sep}router`);
  // 实例化KoaRouter
  const router = new KoaRouter();

  //注册所有路由
  const fileList = glob.sync(path.resolve(routerPath, `.${sep}**${sep}**.js`));
  fileList.forEach((file) => {
    require(path.resolve(file))(app, router);
  });

  //路由兜底
  router.get("*", async (ctx, next) => {
    ctx.status = 302;
    ctx.redirect(`${app?.options?.homePage ?? "/"}`);
  });

  //路由注册到app上
  app.use(router.routes()).use(router.allowedMethods());
};
