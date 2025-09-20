const glob = require("glob");
const path = require("path");
const { sep } = path;
/**
 * controller loader
 * @param {object} app Koa实例
 * 加载所有controller,可通过'app.controller.${目录}.${文件}' 访问
 *
 * 例子：
 * app/controller
 *  |
 *  | -- custome-module
 *          |
 *          | -- custom-controller.js
 *  ==> app.controller.customModule.customController
 */
module.exports = (app) => {
  //读取app/controller目录下的所有文件
  const controllerPath = path.resolve(app.businessPath, `.${sep}controller`);
  const fileList = glob.sync(
    path.resolve(controllerPath, `.${sep}**${sep}**.js`)
  );
  const controller = {};
  fileList.forEach((file) => {
    //获取文件的绝对路径
    let name = path.resolve(file);
    //截取controller的目录名称
    name = name.substring(
      name.lastIndexOf(`controller${sep}`) + `controller${sep}`.length,
      name.lastIndexOf(".")
    );
    name = name.replace(/[_-][a-z]/gi, (s) => s.substring(1).toUpperCase());
    //挂在controller到app对象中
    let tempController = controller;
    const names = name.split(sep);
    // const names = ["a", "b", "c", "last"];
    for (let i = 0, len = names.length; i < len; ++i) {
      if (i === len - 1) {
        const ControllerModule = require(path.resolve(file))(app);
        tempController[names[i]] = new ControllerModule();
      } else {
        if (!tempController[names[i]]) {
          tempController[names[i]] = {};
        }
        tempController = tempController[names[i]];
      }
    }
    console.log("controller", tempController);
  });
  app.controller = controller;
};
