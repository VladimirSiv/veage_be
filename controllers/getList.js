const { uniqBy, flatten } = require("lodash");
const setListHeaders = require("./getListHeaders");

const parseQuery = (query) => {
  const { range, sort, filter } = query;
  const [from, to] = range ? JSON.parse(range) : [0, 100];
  const { q, ...filters } = JSON.parse(filter || "{}");
  return {
    offset: from,
    limit: to - from + 1,
    filter: filters,
    order: [sort ? JSON.parse(sort) : ["id", "ASC"]],
    q,
  };
};

const getFilteredList = async ({
  where,
  limit,
  offset,
  order,
  model,
  queryParams,
}) => {
  const result = await model.findAndCountAll({
    offset: offset,
    limit: limit,
    order: order,
    where: where,
    ...queryParams,
  });
  const rows = uniqBy(flatten(result.rows).slice(0, limit), "id");
  return { rows, count: result.count };
};

const getMany = async (
  res,
  where,
  limit,
  offset,
  order,
  model,
  queryParams
) => {
  const { rows, count } = await getFilteredList({
    where,
    limit,
    offset,
    order,
    model,
    queryParams,
  });
  setListHeaders(res, offset, rows.length, count);
  res.json(rows);
};

module.exports = { parseQuery, getMany };
