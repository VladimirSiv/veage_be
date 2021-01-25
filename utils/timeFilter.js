const { Op } = require("sequelize");

const createdAtFilter = (where, filter) => {
  const createdAt = {};
  if (filter.from) createdAt[Op.gte] = filter["from"];
  if (filter.to) createdAt[Op.lt] = filter["to"];
  const keys = Reflect.ownKeys(createdAt);
  if (keys.length !== 0) where["createdAt"] = createdAt;
};

const overview_filter = (filter) => {
  const where = {};
  createdAtFilter(where, filter);
  return where;
};

const stats_filter = (user, filter) => {
  const where = { userId: user.dataValues.id };
  createdAtFilter(where, filter);
  return where;
};

const timeFilter = {
  overview_filter: overview_filter,
  stats_filter: stats_filter,
};

module.exports = timeFilter;
