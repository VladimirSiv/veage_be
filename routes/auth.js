const { authController } = require("../controllers");

module.exports = function (app) {
  app.post("/signin", authController.signin);
  app.get("/token", authController.refresh_token);
};
