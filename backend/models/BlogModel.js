const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/dbMySQL.js");
class BLOG extends Model {}

BLOG.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    authorID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "USER",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    author_profile_image: { type: DataTypes.STRING, allowNull: true },
    isPublished: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isScheduled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isDraft: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    scheduledFor: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    image: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },

    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    shares: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
  },
  {
    sequelize,
    modelName: "BLOG",
    tableName: "BLOG",
    timestamps: true,
  }
);

module.exports = BLOG;
