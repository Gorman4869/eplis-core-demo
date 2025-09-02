const glob = require("glob");
const path = require("path");
const { sep } = path;
/**
 * middleware loader
 * @param {object} app Koa实例
 * 加载所有middleware,可通过'app.middlewars.${目录}.${文件}' 访问
 *
 * 例子：
 * app/middleware
 *  |
 *  | -- custome-module
 *          |
 *          | -- custom-middleware.js
 *  ==> app.middlewars.customModule.customMiddleware
 */
module.exports = (app) => {
  //读取app/middleware目录下的所有文件
  const middlewarePath = path.resolve(app.businessPath, `.${sep}middleware`);
  console.log("middlewarePath", middlewarePath);
  const fileList = glob.sync(
    path.resolve(middlewarePath, `.${sep}**${sep}**.js`)
  );
  console.log("middlewarePath", fileList);
};
