const { DataTypes, Model, UUIDV4 } = require("sequelize");
const sequelize = require("../config/dbMySQL.js");

class SAVE_BLOG_FOR_LATER extends Model {}

SAVE_BLOG_FOR_LATER.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "USER",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    blogID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "BLOG",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "SAVE_BLOG_FOR_LATER",
    tableName: "SAVE_BLOG_FOR_LATER",
    timestamps: true,
  }
);

module.exports = SAVE_BLOG_FOR_LATER;
