const createError = require("http-errors");
const db = require("../models");
const { parseQuery, getMany } = require("./getList");
const Project = db.Project;

get = (req, res, next) => {
  return Project.findByPk(req.params.id)
    .then((project) => {
      res.status(200).json(project.dataValues);
    })
    .catch((err) => {
      return next(createError(500, "Can't get project"));
    });
};

getList = (req, res, next) => {
  try {
    const { limit, offset, filter, order } = parseQuery(req.query);
    getMany(res, filter, limit, offset, order, Project, null);
  } catch (err) {
    next(createError(500, "Can't get project"));
  }
};

all = (req, res, next) => {
  return Project.findAll({
    where: { disabled: false },
    attributes: ["id", "name"],
  })
    .then((projects) => {
      res.status(200).json(projects);
    })
    .catch((err) => {
      return next(createError(500, "Internal Error"));
    });
};

create = (req, res, next) => {
  return Project.create(req.body)
    .then((project) => {
      res.status(201).json({ id: project.dataValues.id });
    })
    .catch((err) => {
      return next(createError(500, "Can't create project"));
    });
};

update = (req, res, next) => {
  return Project.findByPk(req.params.id)
    .then((project) => {
      project
        .update(req.body, {
          where: {
            id: req.body.id,
          },
        })
        .then((update) => {
          res.status(200).json({
            id: update.dataValues.id,
          });
        });
    })
    .catch((err) => {
      return next(createError(500, "Can't update project"));
    });
};

destroy = (req, res, next) => {
  return Project.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((project) => {
      res.status(200).json({ id: req.params.id });
    })
    .catch((err) => {
      return next(createError(500, "Internal error"));
    });
};

const projectController = {
  get: get,
  getList: getList,
  create: create,
  update: update,
  destroy: destroy,
  all: all,
};

module.exports = projectController;
