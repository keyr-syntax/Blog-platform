const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/dbMySQL.js");

class BLOG_TAGS extends Model {}
BLOG_TAGS.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    tag_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    blogID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "BLOG",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    tag_creator_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "USER",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "BLOG_TAGS",
    tableName: "BLOG_TAGS",
    timestamps: true,
  }
);

module.exports = BLOG_TAGS;
