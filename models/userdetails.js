"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserDetails extends Model {
    static associate(models) {
      UserDetails.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  UserDetails.init(
    {
      userId: DataTypes.INTEGER,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      birthday: DataTypes.DATE,
      jobTitle: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      paranoid: true,
      modelName: "UserDetails",
      timestamps: true,
    }
  );
  return UserDetails;
};
