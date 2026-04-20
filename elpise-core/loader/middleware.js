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
  const middlewarePath = path.resolve(app.businessPath, `.${sep}middlewares`);
  const fileList = glob.sync(
    path.resolve(middlewarePath, `.${sep}**${sep}**.js`),
  );
  const middlewares = {};
  fileList.forEach((file) => {
    //获取文件的绝对路径
    let name = path.resolve(file);
    //截取middleware的目录名称
    name = name.substring(
      name.lastIndexOf(`middlewares${sep}`) + `middlewares${sep}`.length,
      name.lastIndexOf("."),
    );
    name = name.replace(/[_-][a-z]/gi, (s) => s.substring(1).toUpperCase());
    //挂在middleware到app对象中
    let tempMiddleware = middlewares;
    const names = name.split(sep);
    for (let i = 0, len = names.length; i < len; ++i) {
      if (i === len - 1) {
        tempMiddleware[names[i]] = require(path.resolve(file))(app);
      } else {
        if (!tempMiddleware[names[i]]) {
          tempMiddleware[names[i]] = {};
        }
        tempMiddleware = tempMiddleware[names[i]];
      }
    }
  });
  // console.log(middlewares, "middleware loaded");
  app.middlewares = middlewares;
};
