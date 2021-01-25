const db = require("../models");
const path = require("path");
const createError = require("http-errors");
const manageJwt = require("./manageJwt");
const bcrypt = require("bcryptjs");
const authConfig = require("../config/auth.config");
const User = db.User;
const UserDetails = db.UserDetails;

refreshToken = (req, res, next) => {
  const refreshToken = req.signedCookies.refreshToken;
  const userId = req.signedCookies.id;
  User.findByPk(userId).then((user) => {
    dbRefreshToken = user.refreshToken;
    if (refreshToken === dbRefreshToken) {
      res.status(200).send({
        access_token: manageJwt.generate_access_token(userId),
        access_expiresIn: parseInt(authConfig.access_expiresIn),
      });
    } else {
      // TODO check this part
      return next(createError(401, "Unauthorized!"));
    }
  });
};

signin = (req, res, next) => {
  User.findOne({
    where: {
      username: req.body.username,
      disabled: false,
    },
    include: {
      model: UserDetails,
    },
  })
    .then((user) => {
      if (!user) {
        return next(createError(404, "User not found"));
      }
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return next(createError(401, "Invalid Password"));
      }
      const refreshToken = manageJwt.generate_refresh_token(user.id);
      user.update({
        lastSeen: new Date(),
        refreshToken: refreshToken,
      });
      user.getRole().then((role) => {
        permissions = role.name;
        const user_info = {
          access_token: manageJwt.generate_access_token(
            user.id,
            permissions,
            user.username
          ),
          access_expiresIn: parseInt(authConfig.access_expiresIn),
        };
        if (user.UserDetail.image) {
          // TODO Fix image path join
          user_info["avatar"] = path.join(
            "images",
            user.UserDetail.image + ".png"
          );
        }
        res.cookie("refreshToken", refreshToken, {
          httpOnly: authConfig.cookie_httpOnly,
          signed: authConfig.cookie_signed,
        });
        res.cookie("id", user.id, {
          httpOnly: authConfig.cookie_httpOnly,
          signed: authConfig.cookie_signed,
        });
        res.status(200).send(user_info);
      });
    })
    .catch((err) => {
      return next(createError(500, err.message));
    });
};

// TODO add signout to invalidate the token

const authController = {
  signin: signin,
  refresh_token: refreshToken,
};

module.exports = authController;
