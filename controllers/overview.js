const db = require("../models");
const createError = require("http-errors");
const { parseQuery, getMany } = require("./getList");
const { pickBy, identity } = require("lodash");
const { timeFilter } = require("../utils");
const Activity = db.Activity;
const Project = db.Project;
const User = db.User;
const Team = db.Team;
const Type = db.Type;

get = (req, res) => {
  return Activity.findOne({
    include: [
      {
        model: Project,
        attributes: ["name"],
      },
      {
        model: User,
        attributes: ["username"],
      },
      {
        model: Type,
        attributes: ["name"],
      },
    ],
    where: { id: req.params.id },
  })
    .then((activity) => {
      res.status(200).json(activity.dataValues);
    })
    .catch((err) => {
      return next(createError(500, "Internal Server Error"));
    });
};

getList = (req, res, next) => {
  try {
    const { limit, offset, filter, order } = parseQuery(req.query);
    const queryParams = {
      include: [
        {
          model: Project,
          attributes: ["name", "disabled"],
        },
        {
          model: User,
          attributes: ["username"],
          where: pickBy({ username: filter["username"] }, identity),
          include: {
            model: Team,
            attributes: ["name"],
            where: pickBy({ name: filter["team"] }, identity),
          },
        },
        {
          model: Type,
          attributes: ["name"],
        },
      ],
    };
    const where = timeFilter.overview_filter(filter);
    getMany(res, where, limit, offset, order, Activity, queryParams);
  } catch (err) {
    next(createError(500, "Internal Server Error"));
  }
};

const overviewController = {
  create: create,
  get: get,
  getList: getList,
  update: update,
  destroy: destroy,
};

module.exports = overviewController;
