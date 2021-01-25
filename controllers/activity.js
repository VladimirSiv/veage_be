const db = require("../models");
const createError = require("http-errors");
const { parseQuery, getMany } = require("./getList");
const Activity = db.Activity;
const Project = db.Project;
const Type = db.Type;
const { Op } = require("sequelize");

get = (req, res, next) => {
  return Activity.findOne({
    where: {
      id: req.params.id,
      userId: req.body.userId,
    },
    include: [
      {
        model: Project,
        attributes: ["name"],
      },
      {
        model: Type,
        attributes: ["name"],
      },
    ],
  })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      return next(createError(500, "Internal Server Error"));
    });
};

getList = (req, res, next) => {
  try {
    const { q, limit, offset, filter, order } = parseQuery(req.query);
    const queryParams = {
      include: [
        {
          model: Project,
          attributes: ["name", "disabled"],
        },
        {
          model: Type,
          attributes: ["name"],
        },
      ],
    };
    let where = filter;
    if (q) {
      qQueryParams = {
        [Op.or]: [
          { title: { [Op.like]: `${q}%` } },
          { description: { [Op.like]: `${q}%` } },
        ],
      };
      where = { ...where, ...qQueryParams };
    }
    getMany(res, where, limit, offset, order, Activity, queryParams);
  } catch (error) {
    next(createError(500, "Internal Server Error"));
  }
};

create = (req, res, next) => {
  return Activity.create(req.body)
    .then((user) => {
      res.status(201).json({
        id: user.dataValues.id,
      });
    })
    .catch((err) => {
      return next(createError(500, "Internal Server Error"));
    });
};

update = (req, res, next) => {
  return Activity.findByPk(req.body.id)
    .then((activity) => {
      activity
        .update(req.body, {
          where: {
            id: req.body.id,
            userId: req.body.userId,
          },
        })
        .then((update) => {
          res.status(200).json({
            id: update.dataValues.id,
          });
        });
    })
    .catch((err) => {
      return next(createError(500, "Internal Server Error"));
    });
};

destroy = (req, res, next) => {
  return Activity.destroy({
    where: {
      id: req.params.id,
      userId: req.body.userId,
    },
  })
    .then((activity) => {
      res.status(200).json({ id: req.params.id });
    })
    .catch((err) => {
      return next(createError(500, "Internal Server Error"));
    });
};

const activityController = {
  create: create,
  get: get,
  getList: getList,
  update: update,
  destroy: destroy,
};

module.exports = activityController;
