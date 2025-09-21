const path = require("path");
const { sep } = path;
/**
 * 根据不同环境加载不同的配置文件
 * 有默认配置文件
 * @param {Object} app
 */
module.exports = (app) => {
  //获取config目录
  const configPath = path.resolve(app.baseDir, `.${sep}config`);

  //获取默认配置文件
  let defaultConfig = {};
  try {
    defaultConfig = require(path.resolve(
      configPath,
      `.${sep}config.default.js`
    ));
  } catch (e) {
    console.log("[exception] there is no config.default file");
  }

  //获取环境配置文件
  let envConfig = {};
  try {
    if (app.env.isLocal()) {
      envConfig = require(path.resolve(configPath, `.${sep}config.local.js`));
    } else if (app.env.isBeta()) {
      envConfig = require(path.resolve(configPath, `.${sep}config.beta.js`));
    } else if (app.env.isProduction()) {
      envConfig = require(path.resolve(
        configPath,
        `.${sep}config.production.js`
      ));
    }
  } catch (e) {
    console.log("[exception] there is no env.config file");
  }

  //覆盖并加载配置文件
  app.config = Object.assign({}, defaultConfig, envConfig);
  console.log(app.config, "app.config");
};
