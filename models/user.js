"use strict";

const { Model } = require("sequelize");
const { Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Role, {
        foreignKey: "roleId",
      });
      User.belongsTo(models.Team, {
        foreignKey: "teamId",
      });
      User.hasMany(models.Activity, {
        onDelete: "CASCADE",
        foreignKey: "userId",
      });
      User.hasOne(models.UserDetails, {
        hooks: true,
        onDelete: "CASCADE",
        foreignKey: "userId",
      });
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      lastSeen: DataTypes.DATE,
      refreshToken: DataTypes.STRING,
      roleId: DataTypes.INTEGER,
      disabled: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      paranoid: true,
      modelName: "User",
      timestamps: true,
      hooks: {
        afterDestroy: (instance, options) => {
          sequelize.models.Activity.findAll({
            attributes: ["id"],
            where: { userId: instance.id },
          }).then((activities) => {
            sequelize.models.Activity.destroy({
              where: {
                id: {
                  [Op.in]: activities.map((activity) => activity.id),
                },
              },
            });
          });
          sequelize.models.UserDetails.findOne({
            where: { userId: instance.id },
          }).then((userDetail) => userDetail.destroy());
        },
      },
    }
  );
  return User;
};
