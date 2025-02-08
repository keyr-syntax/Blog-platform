const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/dbMySQL.js");
const USER = require("../models/userModel.js");
const BLOG = require("./BlogModel.js");
class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    commentBody: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: USER,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    commented_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    topLevelCommentID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    blogID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: BLOG,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "Comment",
    tableName: "Comment",
    timestamps: true,
  }
);

module.exports = Comment;
