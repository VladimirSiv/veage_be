"use strict";

const bcrypt = require("bcryptjs");
const faker = require("faker");
const { seedUtils } = require("../../utils");

const generate_users = () => {
  let users = [];
  const roleId = seedUtils.randomArray(20, 3);
  const teamId = seedUtils.randomArray(20, 5);
  for (let i = 0; i < 20; i++) {
    let user = {
      username: faker.internet.userName(),
      password: bcrypt.hashSync("pass", 8),
      roleId: roleId[i],
      teamId: teamId[i],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users.push(user);
  }
  return users;
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Users",
      [
        {
          username: "admin",
          password: bcrypt.hashSync("pass", 8),
          roleId: 1,
          teamId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: "moderator",
          password: bcrypt.hashSync("pass", 8),
          roleId: 2,
          teamId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: "user",
          password: bcrypt.hashSync("pass", 8),
          roleId: 3,
          teamId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        ...generate_users(),
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
