const { authJwt } = require("../middleware");
const { overviewController } = require("../controllers");

module.exports = function (app) {
  app.get(
    "/overview",
    authJwt.verifyToken,
    authJwt.isModeratorOrAdmin,
    overviewController.getList
  );

  app.get(
    "/overview/:id",
    authJwt.verifyToken,
    authJwt.isModeratorOrAdmin,
    overviewController.get
  );
};
