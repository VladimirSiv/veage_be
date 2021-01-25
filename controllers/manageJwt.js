const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.User;

get_refresh_token = (id) => {
  return User.findByPk(id).refreshToken;
};

generate_access_token = (id, permissions, username) => {
  return jwt.sign(
    {
      id: id,
      permissions: permissions,
      username: username,
    },
    config.access_secret,
    {
      expiresIn: config.access_expiresIn,
      algorithm: config.algorithm,
    }
  );
};

generate_refresh_token = (id) => {
  return jwt.sign(
    {
      id: id,
    },
    config.refresh_secret,
    { expiresIn: config.refresh_expiresIn }
  );
};

const manageJwt = {
  generate_access_token: generate_access_token,
  generate_refresh_token: generate_refresh_token,
};

module.exports = manageJwt;
