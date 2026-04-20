module.exports = (app) => {
  const BaseController = require("./base")(app);
  return class ProjectController extends BaseController {
    /**获取项目列表
     * @param {object} ctx
     */
    async getList(ctx) {
      const { project: projectService } = app.service;

      const projectList = await projectService.getList();
      this.success(ctx, projectList);
    }
  };
};
