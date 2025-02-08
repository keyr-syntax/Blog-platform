const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/dbMySQL.js");

class BLOG_VIEW_COUNTER extends Model {}

BLOG_VIEW_COUNTER.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "USER",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    viewer_username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    blogID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    blogTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "BLOG_VIEW_COUNTER",
    tableName: "BLOG_VIEW_COUNTER",
    timestamps: true,
  }
);

module.exports = BLOG_VIEW_COUNTER;
