module.exports = (app) => {
  const BaseService = require("./base")(app);
  return class ProjectService extends BaseService {
    async getList() {
      return [
        {
          name: "Project 1",
          description: "This is project 1",
        },
        {
          name: "Project 2",
          description: "This is project 2",
        },
      ];
    }
  };
};
