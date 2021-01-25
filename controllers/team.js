const createError = require("http-errors");
const db = require("../models");
const path = require("path");
const { parseQuery, getMany } = require("./getList");
const Team = db.Team;
const User = db.User;
const UserDetails = db.UserDetails;

get = (req, res, next) => {
  return Team.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: User,
        attributes: ["username"],
        include: {
          model: UserDetails,
          attributes: ["firstName", "lastName", "jobTitle", "image"],
        },
      },
    ],
  })
    .then((team) => {
      // TODO see if sequelize can handle this
      team.Users.map(
        (user) =>
          (user.UserDetail.image = user.UserDetail.image
            ? path.join("images", user.UserDetail.image + ".png")
            : null)
      );
      res.status(200).json(team);
    })
    .catch((err) => {
      return next(createError(500, "Internal Error"));
    });
};

getList = (req, res, next) => {
  try {
    const { limit, offset, filter, order } = parseQuery(req.query);
    getMany(res, filter, limit, offset, order, Team, null);
  } catch (err) {
    next(createError(500, "Internal Error"));
  }
};

all = (req, res, next) => {
  return Team.findAll({ attributes: ["id", "name"] })
    .then((team) => {
      res.status(200).json(team);
    })
    .catch((err) => {
      return next(createError(500, "Internal Error"));
    });
};

create = (req, res, next) => {
  return Team.create(req.body)
    .then((team) => {
      res.status(201).json({ id: team.dataValues.id });
    })
    .catch((err) => {
      return next(createError(500, "Internal Error"));
    });
};

const teamController = {
  get: get,
  getList: getList,
  all: all,
  create: create,
};

module.exports = teamController;
