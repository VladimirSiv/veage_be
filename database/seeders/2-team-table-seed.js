"use strict";

const { seedUtils } = require("../../utils");

const generate_teams = () => {
  let teams = [];
  for (let i = 1; i < 6; i++) {
    let team = {
      name: "Team" + i,
      description: seedUtils.rich_text(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    teams.push(team);
  }
  return teams;
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Teams", generate_teams(), {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Teams", null, {});
  },
};
