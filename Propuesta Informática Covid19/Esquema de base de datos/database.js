const { Sequelize } = require("sequelize");
const { databaseConfig } = require("./config");


const sequelize = new Sequelize(databaseConfig);

module.exports = sequelize;
