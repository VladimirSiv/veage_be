"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Type extends Model {
    static associate(models) {
      Type.hasMany(models.Activity, {
        foreignKey: "typeId",
      });
    }
  }
  Type.init(
    {
      name: DataTypes.STRING,
      disabled: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      paranoid: true,
      modelName: "Type",
      timestamps: true,
    }
  );
  return Type;
};
