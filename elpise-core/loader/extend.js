const glob = require("glob");
const path = require("path");
const { sep } = path;
/**
 * extend loader
 * @param {object} app Koa实例
 * 加载所有extend,可通过'app.extend.${文件}' 访问
 *
 * 例子：
 * app/extend
 *    |
 *    | -- custom-extend.js
 *  ==> app.extend
 */
module.exports = (app) => {
  //读取app/extend目录下的所有文件
  const extendPath = path.resolve(app.businessPath, `.${sep}extend`);
  const fileList = glob.sync(path.resolve(extendPath, `.${sep}**${sep}**.js`));
  //   const extend = {};
  fileList.forEach((file) => {
    //获取文件的绝对路径
    let name = path.resolve(file);
    //截取extend的目录名称
    name = name.substring(
      name.lastIndexOf(`extend${sep}`) + `extend${sep}`.length,
      name.lastIndexOf(".")
    );
    name = name.replace(/[_-][a-z]/gi, (s) => s.substring(1).toUpperCase());

    //处理app已经存在的extend
    if (app[name]) {
      console.log(`[extend load error] extend ${name} already exists`);
      return;
    }
    //挂在extend到app对象中
    app[name] = require(path.resolve(file))(app);
  });
};
