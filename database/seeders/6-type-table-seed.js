"use strict";

const faker = require("faker");

const generate_types = () => {
  let types = [];
  for (let i = 1; i < 6; i++) {
    let type = {
      name: faker.random.word(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    types.push(type);
  }
  return types;
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Types", generate_types(), {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Types", null, {});
  },
};
