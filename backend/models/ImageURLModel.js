const { DataTypes, Model, UUIDV4 } = require("sequelize");
const sequelize = require("../config/dbMySQL.js");
class IMAGE_URL extends Model {}
IMAGE_URL.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageURL: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isImageForBlog: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "IMAGE_URL",
    tableName: "IMAGE_URL",
    timestamps: true,
  }
);

module.exports = IMAGE_URL;
