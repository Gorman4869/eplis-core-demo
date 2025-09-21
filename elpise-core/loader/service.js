const glob = require("glob");
const path = require("path");
const { sep } = path;
/**
 * service loader
 * @param {object} app Koa实例
 * 加载所有middleware,可通过'app.service.${目录}.${文件}' 访问
 *
 * 例子：
 * app/service
 *  |
 *  | -- custome-module
 *          |
 *          | -- custom-service.js
 *  ==> app.service.customModule.customService
 */
module.exports = (app) => {
  //读取app/service目录下的所有文件
  const servicePath = path.resolve(app.businessPath, `.${sep}service`);
  const fileList = glob.sync(path.resolve(servicePath, `.${sep}**${sep}**.js`));
  const service = {};
  fileList.forEach((file) => {
    //获取文件的绝对路径
    let name = path.resolve(file);
    //截取service的目录名称
    name = name.substring(
      name.lastIndexOf(`service${sep}`) + `service${sep}`.length,
      name.lastIndexOf(".")
    );
    name = name.replace(/[_-][a-z]/gi, (s) => s.substring(1).toUpperCase());
    //挂在service到app对象中
    let tempService = service;
    const names = name.split(sep);
    for (let i = 0, len = names.length; i < len; ++i) {
      if (i === len - 1) {
        const ServiceModule = require(path.resolve(file))(app);
        tempService[names[i]] = new ServiceModule();
      } else {
        if (!tempService[names[i]]) {
          tempService[names[i]] = {};
        }
        tempService = tempService[names[i]];
      }
    }
  });
  app.service = service;
};
