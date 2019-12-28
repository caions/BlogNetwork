const Sequelize = require('sequelize');


const sequelize = new Sequelize('posts', 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql'
  });

  const Post = sequelize.define('post', {
    titulo:{
        type: Sequelize.STRING,
        allowNull: false
    },
    texto:{
        type: Sequelize.STRING,
        allowNull: false
    }
  });

  //Post.sync({ force: true });


  module.exports = Post