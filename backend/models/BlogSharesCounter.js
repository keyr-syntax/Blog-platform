const { DataTypes, Model, UUIDV4 } = require("sequelize");
const sequelize = require("../config/dbMySQL.js");

class BLOG_SHARE_COUNTER extends Model {}

BLOG_SHARE_COUNTER.init(
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
    },
    blog_shared_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    blogID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    blogTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sharedOn: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "BLOG_SHARE_COUNTER",
    tableName: "BLOG_SHARE_COUNTER",
    timestamps: true,
  }
);

module.exports = BLOG_SHARE_COUNTER;
