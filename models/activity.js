"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Activity extends Model {
    static associate(models) {
      Activity.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      Activity.belongsTo(models.Project, {
        foreignKey: "projectId",
      });
      Activity.belongsTo(models.Type, {
        foreignKey: "typeId",
      });
    }
  }
  Activity.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      hours: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      projectId: DataTypes.INTEGER,
      typeId: DataTypes.INTEGER,
      date: DataTypes.DATE,
    },
    {
      sequelize,
      paranoid: true,
      modelName: "Activity",
      timestamps: true,
    }
  );
  return Activity;
};
