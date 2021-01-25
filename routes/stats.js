const { statsController } = require("../controllers");
const { authJwt } = require("../middleware");

module.exports = function (app) {
  app.get(
    "/stats/hours",
    authJwt.verifyToken,
    authJwt.isModeratorOrAdmin,
    statsController.getHours
  );

  app.get(
    "/stats/days",
    authJwt.verifyToken,
    authJwt.isModeratorOrAdmin,
    statsController.getDays
  );

  app.get(
    "/stats/project-activity",
    authJwt.verifyToken,
    authJwt.isModeratorOrAdmin,
    statsController.getProjectActivity
  );

  app.get(
    "/stats/global",
    authJwt.verifyToken,
    authJwt.isModeratorOrAdmin,
    statsController.getGlobal
  );

  app.get(
    "/stats/project-type",
    authJwt.verifyToken,
    authJwt.isModeratorOrAdmin,
    statsController.getProjectType
  );
};
