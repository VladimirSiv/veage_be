const db = require("../models");
const { Op } = require("sequelize");
const createError = require("http-errors");
const { pickBy, identity } = require("lodash");
const { sequelize } = require("../models");
const { nivoFormat, timeFilter } = require("../utils");
const User = db.User;
const Activity = db.Activity;
const Project = db.Project;
const Type = db.Type;

getHours = (req, res, next) => {
  const filter = pickBy(JSON.parse(req.query.filter), identity);
  if (filter) {
    return User.findByPk(filter.user)
      .then((user) => {
        Activity.findAll({
          attributes: [
            ["projectId", "id"],
            [sequelize.fn("SUM", sequelize.col("hours")), "hours"],
          ],
          where: timeFilter.stats_filter(user, filter),
          group: ["projectId"],
          include: {
            model: Project,
            attributes: ["name"],
          },
        }).then((countedHours) => {
          res.status(200).json(nivoFormat.countedHours(countedHours));
        });
      })
      .catch((err) => {
        return next(createError(500, "Internal Error"));
      });
  } else {
    return next(createError(400, "Bad Request"));
  }
};

getDays = (req, res, next) => {
  const filter = pickBy(JSON.parse(req.query.filter), identity);
  if (filter) {
    return User.findByPk(filter.user)
      .then((user) => {
        const date_format = sequelize.fn(
          "date_format",
          sequelize.col("createdAt"),
          "%Y-%m-%d"
        );
        Activity.findAll({
          attributes: [
            [date_format, "day"],
            [sequelize.fn("SUM", sequelize.col("hours")), "value"],
          ],
          where: timeFilter.stats_filter(user, filter),
          group: [date_format],
          order: [[date_format, "DESC"]],
        }).then((days) => {
          res.status(200).json(days);
        });
      })
      .catch((err) => {
        return next(createError(500, "Internal Error"));
      });
  } else {
    return next(createError(400, "Bad Request"));
  }
};

getProjectActivity = (req, res, next) => {
  Activity.findAll({
    include: [
      {
        model: Project,
        attributes: ["name"],
      },
    ],
    attributes: [
      [sequelize.fn("DATE", sequelize.col("Activity.createdAt")), "x"],
      [sequelize.fn("COUNT", "project"), "y"],
    ],
    where: {
      createdAt: {
        [Op.gte]: sequelize.literal(`DATE_SUB(CURDATE(), INTERVAL 30 DAY)`),
      },
    },
    group: ["x", "projectId"],
    order: [[sequelize.col("x"), "ASC"]],
  })
    .then((result) => {
      res.status(200).json(nivoFormat.projectActivity(result));
    })
    .catch((err) => {
      return next(createError(500, "Internal Error"));
    });
};

getGlobal = (req, res, next) => {
  Promise.all([
    Project.count({ where: { disabled: 0 } }),
    User.count({
      where: {
        lastSeen: { [Op.gte]: sequelize.literal(`CURDATE() - INTERVAL 7 DAY`) },
      },
    }),
    Activity.sum("hours", {
      where: {
        date: { [Op.gte]: sequelize.literal(`CURDATE() - INTERVAL 7 DAY`) },
      },
    }),
    Activity.count({
      where: {
        date: { [Op.gte]: sequelize.literal(`CURDATE() - INTERVAL 7 DAY`) },
      },
    }),
    Project.count({ where: { disabled: 1 } }),
    User.count({ where: { disabled: 1 } }),
  ])
    .then(
      ([
        activeProjects,
        activeUsers,
        weekHours,
        weekActivities,
        disabledProjects,
        disabledUsers,
      ]) => {
        const result = {
          activeProjects: activeProjects,
          activeUsers: activeUsers,
          weekHours: weekHours,
          weekActivities: weekActivities,
          disabledProjects: disabledProjects,
          disabledUsers: disabledUsers,
        };
        res.status(200).json(result);
      }
    )
    .catch((err) => {
      return next(createError(500, "Internal Error"));
    });
};

getProjectType = (req, res, next) => {
  return Activity.findAll({
    attributes: [
      ["projectId", "project"],
      ["typeId", "type"],
      [sequelize.fn("COUNT", "project"), "value"],
    ],
    group: ["project", "type"],
    include: [
      {
        model: Type,
        attributes: ["name"],
      },
      {
        model: Project,
        attributes: ["name"],
      },
    ],
  })
    .then((data) => {
      res.status(200).json(nivoFormat.projectType(data));
    })
    .catch((err) => {
      return next(createError(500, "Internal Error"));
    });
};

const statsController = {
  getHours: getHours,
  getDays: getDays,
  getProjectActivity: getProjectActivity,
  getGlobal: getGlobal,
  getProjectType: getProjectType,
};

module.exports = statsController;
