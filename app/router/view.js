module.exports = (app, router) => {
  const { view: viewController } = app.controller;
  //用户输入http://ip:port/view/page1, 就能渲染出page1
  router.get("/view/:page", viewController.renderPage.bind(viewController));
};
