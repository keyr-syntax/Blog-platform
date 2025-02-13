const Sequelize = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize("keyr", "root", "keyr", {
  dialect: "mysql",
  host: "localhost",
  logging: false,
});

module.exports = sequelize;
