const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const createError = require("http-errors");
const db = require("../models");
const User = db.User;

verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const access_token = authHeader && authHeader.split(" ")[1];
  if (!access_token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }
  jwt.verify(access_token, config.access_secret, (err, decoded) => {
    if (err) {
      return next(createError(401, "Unauthorized!"));
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRole().then((role) => {
      if (role.name === "admin") {
        next();
        return;
      }
      return next(createError(403, "Requires Admin Role!"));
    });
  });
};

isModerator = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRole().then((role) => {
      if (role.name === "moderator") {
        next();
        return;
      }
      return next(createError(403, "Requires Moderator Role!"));
    });
  });
};

isModeratorOrAdmin = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRole().then((role) => {
      if (role.name === "admin" || role.name === "moderator") {
        next();
        return;
      }
      return next(createError(403, "Requires Moderator or Admin Role!"));
    });
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isModerator: isModerator,
  isModeratorOrAdmin: isModeratorOrAdmin,
};

module.exports = authJwt;
