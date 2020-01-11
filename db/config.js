const Sequelize = require('sequelize');

/*
const sequelize = new Sequelize('blogNetwork', 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql'
});*/

const sequelize = new Sequelize(process.env.HEROKU_DATABASE_NAME, process.env.HEROKU_USERNAME, process.env.HEROKU_PASS, {
  host: process.env.HEROKU_HOST,
  dialect: 'mysql'
});

module.exports = sequelize