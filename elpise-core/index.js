const Koa = require("koa");
const path = require("path");
const { sep } = path;
const env = require("./env");
const routerLoader = require("./loader/router");
const serviceLoader = require("./loader/service");
const routerSchemaLoader = require("./loader/router-schema");
const middlewareLoader = require("./loader/middleware");
const extendLoader = require("./loader/extend");
const controllerLoader = require("./loader/controller");
const configLoader = require("./loader/config");

module.exports = {
  /**
   * 项目启动
   * @param {*} options
   */
  start(options = {}) {
    const app = new Koa();

    //应用配置
    app.options = options;

    //基础路径
    app.baseDir = process.cwd();

    //业务文件路径
    app.businessPath = path.resolve(app.baseDir, `.${sep}app`);

    //获取项目环境
    app.env = env();
    console.log(`--start-env: ${app.env.get()}--`);

    //加载config
    configLoader(app);
    console.log(`--start-load: configLoader done--`);

    //加载中间件
    middlewareLoader(app);
    console.log(`--start-load: middlewareLoader done--`);

    //加载routerSchema
    routerSchemaLoader(app);
    console.log(`--start-load: routerSchemaLoader done--`);

    //加载controller
    controllerLoader(app);
    console.log(`--start-load: controllerLoader done--`);

    //加载service
    serviceLoader(app);
    console.log(`--start-load: serviceLoader done--`);

    //加载extend
    extendLoader(app);
    console.log(`--start-load: extendLoader done--`);

    //注册全局中间件
    try {
      require(`${app.businessPath}${sep}middleware.js`)(app);
      console.log(`--start-load: global middleware done--`);
    } catch (error) {
      console.log("[exception]  global middleware error");
    }

    //加载router
    routerLoader(app);
    console.log(`--start-load: routerLoader done--`);

    try {
      const port = process.env.PORT || 8000;
      const host = process.env.HOST || "0.0.0.0";
      app.listen(port, host);
      console.log(`Server running on http://${host}:${port}`);
    } catch (error) {
      console.error(error);
    }
  },
};
