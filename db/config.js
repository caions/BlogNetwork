const Sequelize = require('sequelize');

/*
const sequelize = new Sequelize('blogNetwork', 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql'
});*/

const sequelize = new Sequelize('heroku_9b1c68a01410f74', 'bdd2280da2e082', '9623cd32', {
  host: 'us-cdbr-iron-east-05.cleardb.net',
  dialect: 'mysql'
});

module.exports = sequelize