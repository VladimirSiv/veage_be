const db = require("../models");
const User = db.User;

userFilter = (req, res, next) => {
  // Here we are adding user_id filter
  // to show only activities for specific user

  // TODO revisit / refactor
  User.findByPk(req.userId).then((user) => {
    user.getRole().then((role) => {
      let filter = req.query["filter"];
      if (!filter) {
        req.query["filter"] = JSON.stringify({ userId: req.userId });
      } else {
        let query = JSON.parse(filter);
        query["userId"] = req.userId;
        req.query["filter"] = JSON.stringify(query);
      }
      next();
    });
  });
};

userBodyId = (req, res, next) => {
  req.body["userId"] = req.userId;
  next();
};

const reqMid = {
  userFilter: userFilter,
  userBodyId: userBodyId,
};

module.exports = reqMid;
