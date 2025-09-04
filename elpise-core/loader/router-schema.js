const glob = require("glob");
const path = require("path");
const { sep } = path;
/**
 * router-schema loader
 * @param {Object} app 
 * 
 * 通过 'json-schema' & 'ajv' 对API规则进行约束
 * app/router-schema/**.js 
 * 输出:
 *  app.routerSchema = {
     '${api1}':${jsonSchema}
 }
 */
module.exports = (app) => {
  const routerSchemaPath = path.resolve(
    app.businessPath,
    `.${sep}router-schema`
  );
  const fileList = glob.sync(
    path.resolve(routerSchemaPath, `.${sep}**${sep}**.js`)
  );
  let routerSchema = {};
  fileList.forEach((file) => {
    routerSchema = {
      ...routerSchema,
      ...require(path.resolve(file)),
    };
  });
  app.routerSchema = routerSchema;
};
