const createError = require("http-errors");
const { parseQuery, getMany } = require("./getList");
const db = require("../models");
const Type = db.Type;

get = (req, res, next) => {
  return Type.findOne({
    where: { id: req.params.id },
    attributes: ["id", "name", "disabled"],
  })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      return next(createError(500, "Internal Error"));
    });
};

getList = (req, res, next) => {
  try {
    const { limit, offset, filter, order } = parseQuery(req.query);
    const queryParams = {
      attributes: ["id", "name", "disabled", "createdAt", "updatedAt"],
    };
    getMany(res, filter, limit, offset, order, Type, queryParams);
  } catch (err) {
    next(createError(500, "Internal Error"));
  }
};

create = (req, res, next) => {
  return Type.create(req.body)
    .then((type) => {
      res.status(201).json({ id: type.dataValues.id });
    })
    .catch((err) => {
      return next(createError(500, "Internal Error"));
    });
};

update = (req, res, next) => {
  return Type.findByPk(req.params.id)
    .then((type) => {
      type
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

const typeController = {
  get: get,
  getList: getList,
  create: create,
  update: update,
};

module.exports = typeController;
