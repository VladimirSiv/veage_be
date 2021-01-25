const { authJwt } = require("../middleware");
const { teamController } = require("../controllers");

module.exports = function (app) {
  app.get("/teams", authJwt.verifyToken, teamController.getList);

  app.get("/teams/all", authJwt.verifyToken, teamController.all);

  app.get("/teams/:id", authJwt.verifyToken, teamController.get);

  app.post(
    "/teams",
    authJwt.verifyToken,
    authJwt.isAdmin,
    teamController.create
  );
};
