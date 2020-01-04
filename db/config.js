const Sequelize = require('sequelize');

/*
const sequelize = new Sequelize('blogNetwork', 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql'
});*/

const sequelize = new Sequelize('heroku_a27bb316a5627a4', 'b82e7955e08fa8', 'ea9896a3', {
  host: 'us-cdbr-iron-east-05.cleardb.net',
  dialect: 'mysql'
});



module.exports = sequelize