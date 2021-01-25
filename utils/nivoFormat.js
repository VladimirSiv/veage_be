const { result } = require("lodash");
const _ = require("lodash");

function lastXDays(x) {
  var result = [];
  for (var i = 0; i < x; i++) {
    var d = new Date();
    d.setDate(d.getDate() - i);
    result.push(d.toISOString().split("T")[0]);
  }
  return result.reverse();
}

const countedHours = (data) => {
  return data.map(function (obj) {
    return { id: obj.Project.name, value: obj.hours };
  });
};

const projectActivity = (data) => {
  // Revisit this and refactor
  const days = lastXDays(30);
  let grouped = {};
  data.forEach((element) => {
    const project = element.Project.name;
    const values = { x: element.dataValues.x, y: element.dataValues.y };
    if (grouped[project]) {
      grouped[element.Project.name].data.push(values);
    } else {
      grouped[project] = { id: project, data: [values] };
    }
  });
  _.forIn(grouped, (value, key) => {
    const remaped = [];
    days.forEach((day) => {
      const result = value.data.find((el) => el.x === day);
      result ? remaped.push(result) : remaped.push({ x: day, y: 0 });
    });
    grouped[key].data = remaped;
  });
  return Object.values(grouped);
};

const projectType = (data) => {
  let grouped = {};
  data.forEach((element) => {
    if (!grouped[element.Project.name]) {
      grouped[element.Project.name] = {};
    }
    grouped[element.Project.name][element.Type.name] = element.dataValues.value;
  });
  let result = [];
  _.forIn(grouped, (value, key) => {
    result.push({ project_name: key, ...value });
  });
  return result;
};

const nivoFormat = {
  countedHours: countedHours,
  projectActivity: projectActivity,
  projectType: projectType,
};

module.exports = nivoFormat;
