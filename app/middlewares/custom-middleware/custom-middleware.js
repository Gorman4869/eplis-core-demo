module.exports = (app) => {
  // console.log("Custom Middleware Loaded");
  return {
    name: "custom-middleware",
    middleware: (req, res, next) => {
      console.log("Custom Middleware Called");
      next();
    },
  };
};
