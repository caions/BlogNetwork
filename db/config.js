const Sequelize = require('sequelize');

/*
const sequelize = new Sequelize('blogNetwork', 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql'
});*/

const sequelize = new Sequelize('myq4eompg0hr4xrj', 'flv4ons388k5kdk6', 'p3bfe7bqk4dhkjtw', {
  host: 'o61qijqeuqnj9chh.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  dialect: 'mysql'
});

module.exports = sequelize