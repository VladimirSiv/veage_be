const db = require("../models");
const path = require("path");
const bcrypt = require("bcryptjs");
const { pickBy, omitBy, isNil, identity } = require("lodash");
const { parseQuery, getMany } = require("./getList");
const createError = require("http-errors");
const User = db.User;
const Role = db.Role;
const Team = db.Team;
const UserDetails = db.UserDetails;
const { Op } = require("sequelize");

get = (req, res, next) => {
  return User.findOne({
    where: { id: req.params.id },
    attributes: { exclude: ["password", "refreshToken", "deletedAt"] },
    include: [
      {
        model: UserDetails,
        attributes: [
          "firstName",
          "lastName",
          "email",
          "birthday",
          "jobTitle",
          "image",
          "updatedAt",
        ],
      },
      {
        model: Role,
        attributes: ["name"],
      },
    ],
  })
    .then((user) => {
      // TODO fix image path join
      user.UserDetail.image = path.join(
        "images",
        user.UserDetail.image + ".png"
      );
      return res.status(200).json(user);
    })
    .catch((err) => {
      return next(createError(500, "Internal Error"));
    });
};

getList = (req, res, next) => {
  try {
    const { q, limit, offset, filter, order } = parseQuery(req.query);
    const queryParams = {
      attributes: ["id", "username", "disabled", "lastSeen", "createdAt"],
      include: [
        {
          model: Team,
          attributes: ["name"],
        },
        {
          model: UserDetails,
          attributes: ["jobTitle"],
        },
      ],
    };
    let where = filter;
    if (q) {
      qQueryParams = {
        [Op.or]: [{ username: { [Op.like]: `${q}%` } }],
      };
      where = { ...where, ...qQueryParams };
    }
    getMany(res, where, limit, offset, order, User, queryParams);
  } catch (err) {
    next(createError(500, "Internal Error"));
  }
};

all = (req, res, next) => {
  return User.findAll({ attributes: ["id", "username"] })
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      return next(createError(500, "Internal Error"));
    });
};

create = (req, res, next) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  }).then((user) => {
    if (user) {
      return next(createError(409, "User already exists"));
    } else {
      User.create({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 8),
        roleId: req.body.roleId,
        teamId: req.body.teamId,
      }).then((user) => {
        let userDetails = req.body.UserDetails;
        userDetails["userId"] = user.dataValues.id;
        UserDetails.create(userDetails);
        return res.status(201).json({ id: user.id });
      });
    }
  });
};

update = (req, res, next) => {
  const password = req.body.password
    ? bcrypt.hashSync(req.body.password, 8)
    : null;

  return User.findByPk(req.body.id)
    .then((user) => {
      user
        .update(
          omitBy(
            {
              username: req.body.username,
              roleId: req.body.roleId,
              teamId: req.body.teamId,
              password: password,
              disabled: req.body.disabled,
            },
            isNil
          ),
          {
            where: {
              id: req.body.id,
            },
          }
        )
        .then((userupdate) => {
          UserDetails.update(
            pickBy(
              {
                birthday: req.body.UserDetail.birthday,
                email: req.body.UserDetail.email,
                firstName: req.body.UserDetail.firstName,
                lastName: req.body.UserDetail.lastName,
                jobTitle: req.body.UserDetail.jobTitle,
              },
              identity
            ),
            { where: { userId: req.body.id } }
          ).then((detailupdate) => {
            res.status(200).json({ id: req.body.id });
          });
        });
    })
    .catch((err) => {
      return next(createError(500, "Can't update user"));
    });
};

destroy = (req, res, next) => {
  return User.destroy({
    where: {
      id: req.params.id,
    },
    individualHooks: true,
  })
    .then((user) => {
      res.status(200).json({ id: req.params.id });
    })
    .catch((err) => {
      return next(createError(500, "Internal Error"));
    });
};

const userController = {
  get: get,
  getList: getList,
  create: create,
  update: update,
  destroy: destroy,
  update: update,
  all: all,
};

module.exports = userController;
