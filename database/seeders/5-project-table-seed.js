"use strict";

const faker = require("faker");
const { seedUtils } = require("../../utils");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Projects",
      [
        {
          name: faker.lorem.word(),
          description: seedUtils.rich_text(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: faker.lorem.word(),
          description: seedUtils.rich_text(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: faker.lorem.word(),
          description: seedUtils.rich_text(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Projects", null, {});
  },
};
