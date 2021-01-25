const { authJwt } = require("../middleware");
const { reqMid } = require("../middleware");
const { activityController } = require("../controllers");

module.exports = function (app) {
  app.get(
    "/activities",
    authJwt.verifyToken,
    reqMid.userFilter,
    activityController.getList
  );

  app.get(
    "/activities/:id",
    authJwt.verifyToken,
    reqMid.userBodyId,
    activityController.get
  );

  app.post(
    "/activities",
    authJwt.verifyToken,
    reqMid.userBodyId,
    activityController.create
  );

  app.put(
    "/activities/:id",
    authJwt.verifyToken,
    reqMid.userBodyId,
    activityController.update
  );

  app.delete(
    "/activities/:id",
    authJwt.verifyToken,
    reqMid.userBodyId,
    activityController.destroy
  );
};
