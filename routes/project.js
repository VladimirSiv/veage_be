const { authJwt } = require("../middleware");
const { projectController } = require("../controllers");

module.exports = function (app) {
  app.get("/projects", authJwt.verifyToken, projectController.getList);

  app.get("/projects/all", authJwt.verifyToken, projectController.all);

  app.get("/projects/:id", authJwt.verifyToken, projectController.get);

  app.post(
    "/projects",
    authJwt.verifyToken,
    authJwt.isAdmin,
    projectController.create
  );

  app.put(
    "/projects/:id",
    authJwt.verifyToken,
    authJwt.isModeratorOrAdmin,
    projectController.update
  );

  app.delete(
    "/projects/:id",
    authJwt.verifyToken,
    authJwt.isAdmin,
    projectController.destroy
  );
};
