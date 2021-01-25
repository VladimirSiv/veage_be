"use strict";

const faker = require("faker");
const { v4: uuidv4 } = require("uuid");
const { seedUtils } = require("../../utils");

const get_image = async () => {
  const image_filename = await uuidv4();
  await seedUtils.downloadIMG(faker.image.image(), image_filename);
  return image_filename;
};

const generate_user_details = async () => {
  let user_details = [];
  for (let i = 1; i < 24; i++) {
    let detail = {
      userId: i,
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      birthday: faker.date.past(),
      jobTitle: faker.name.jobTitle(),
      image: await get_image(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    user_details.push(detail);
  }
  return user_details;
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "UserDetails",
      await generate_user_details(),
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("UserDetails", null, {});
  },
};
