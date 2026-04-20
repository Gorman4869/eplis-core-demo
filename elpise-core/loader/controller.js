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
    path.resolve(controllerPath, `.${sep}**${sep}**.js`),
  );
  //遍历所有文件目录，把内容挂载到app.controller对象上
  const controller = {};
  fileList.forEach((file) => {
    //获取文件的绝对路径，并截取文件名
    let name = path.resolve(file);
    //截取controller的目录名称 app/controller/custom-module/custom-controller.js => custom-module/custom-controller
    name = name.substring(
      name.lastIndexOf(`controller${sep}`) + `controller${sep}`.length,
      name.lastIndexOf("."),
    );
    //将目录名称中的'-'和'_'替换为驼峰命名 custom-module/custom-controller.js => customModule.customController
    name = name.replace(/[_-][a-z]/gi, (s) => s.substring(1).toUpperCase());
    //挂在controller到app对象中
    let tempController = controller;
    const names = name.split(sep); //分割目录名称["customModule(目录)", "customController(文件)"]
    // const names = ["a", "b", "c", "last"];
    for (let i = 0, len = names.length; i < len; ++i) {
      if (i === len - 1) {
        //如果是最后一个，既是文件，则加载controller模块
        const ControllerModule = require(path.resolve(file))(app);
        tempController[names[i]] = new ControllerModule();
      } else {
        //如果不是最后一个，既是目录，则创建一个空对象
        if (!tempController[names[i]]) {
          tempController[names[i]] = {};
        }
        tempController = tempController[names[i]];
      }
    }
  });
  app.controller = controller;
};
