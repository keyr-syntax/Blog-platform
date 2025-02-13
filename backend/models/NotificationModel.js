const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/dbMySQL.js");

class NOTIFICATION extends Model {}

NOTIFICATION.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    commentID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    commentBody: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isComment: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isReply: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isLike: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    blogID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    authorIDOrRepliedTo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isNotified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "NOTIFICATION",
    tableName: "NOTIFICATION",
    timestamps: true,
  }
);

module.exports = NOTIFICATION;
