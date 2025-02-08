const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/dbMySQL.js");
class BLOG_LIKES_COUNTER extends Model {}

BLOG_LIKES_COUNTER.init(
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
    blog_liked_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    blogID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "BLOG",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    blogTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "BLOG_LIKES_COUNTER",
    tableName: "BLOG_LIKES_COUNTER",
    timestamps: true,
  }
);

module.exports = BLOG_LIKES_COUNTER;
