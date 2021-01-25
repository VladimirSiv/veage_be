"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      Project.hasMany(models.Activity, {
        foreignKey: "projectId",
      });
    }
  }
  Project.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      disabled: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      paranoid: true,
      modelName: "Project",
      timestamps: true,
    }
  );
  return Project;
};
