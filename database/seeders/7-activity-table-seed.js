"use strict";

const faker = require("faker");
const { seedUtils } = require("../../utils");

const generate_activities = () => {
  let activities = [];
  const projects = seedUtils.randomArray(1500, 3);
  const types = seedUtils.randomArray(1500, 5);
  const users = seedUtils.randomArray(1500, 23);

  for (let i = 0; i < 1500; i++) {
    const date = seedUtils.randomDate(new Date(2020, 1, 1), new Date(), 9, 17);
    let activity = {
      title: faker.lorem.word(),
      projectId: projects[i],
      description: seedUtils.rich_text(),
      typeId: types[i],
      hours: Math.random() * (9 - 1) + 1,
      userId: users[i],
      date: date,
      createdAt: date,
      updatedAt: new Date(),
    };
    activities.push(activity);
  }
  return activities;
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Activities", generate_activities(), {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Activities", null, {});
  },
};
