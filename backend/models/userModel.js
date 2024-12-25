const { DataTypes, Model, UUIDV4 } = require("sequelize");
const sequelize = require("../config/dbMySQL.js");
const bcrypt = require("bcrypt");

class USER extends Model {}

USER.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    isBlocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    profile_image: { type: DataTypes.STRING, allowNull: true },
    biography: { type: DataTypes.TEXT("long"), allowNull: true },
    profession: { type: DataTypes.STRING, allowNull: true },
    location: { type: DataTypes.STRING, allowNull: true },
    education: { type: DataTypes.STRING, allowNull: true },
    hobby: { type: DataTypes.STRING, allowNull: true },
    personal_website_link: { type: DataTypes.STRING, allowNull: true },

    is_available_for_work: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    is_email_public: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    is_blogger: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "USER",
    tableName: "USER",
    hooks: {
      beforeCreate: async (user) => {
        user.password = await bcrypt.hash(user.password, 10);
      },
    },
    timestamps: true,
  }
);

module.exports = USER;
