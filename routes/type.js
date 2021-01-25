const { authJwt } = require("../middleware");
const { typeController } = require("../controllers");

module.exports = function (app) {
  app.get(
    "/types",
    authJwt.verifyToken,
    authJwt.isModeratorOrAdmin,
    typeController.getList
  );

  app.get(
    "/types/:id",
    authJwt.verifyToken,
    authJwt.isModeratorOrAdmin,
    typeController.get
  );

  app.post(
    "/types",
    authJwt.verifyToken,
    authJwt.isAdmin,
    typeController.create
  );

  app.put(
    "/types/:id",
    authJwt.verifyToken,
    authJwt.isModeratorOrAdmin,
    typeController.update
  );
};
