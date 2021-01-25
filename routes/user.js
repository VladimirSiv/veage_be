const { authJwt } = require("../middleware");
const { fileupload, userController } = require("../controllers");

module.exports = function (app) {
  app.get(
    "/users",
    authJwt.verifyToken,
    authJwt.isModeratorOrAdmin,
    userController.getList
  );

  app.get(
    "/users/all",
    authJwt.verifyToken,
    authJwt.isModeratorOrAdmin,
    userController.all
  );

  app.get(
    "/users/:id",
    authJwt.verifyToken,
    authJwt.isModeratorOrAdmin,
    userController.get
  );

  app.post(
    "/users",
    authJwt.verifyToken,
    authJwt.isAdmin,
    fileupload.save,
    userController.create
  );

  app.put(
    "/users/:id",
    authJwt.verifyToken,
    authJwt.isAdmin,
    fileupload.save,
    userController.update
  );

  app.delete(
    "/users/:id",
    authJwt.verifyToken,
    authJwt.isAdmin,
    userController.destroy
  );
};
