const Sequelize = require('sequelize');

const sequelize = new Sequelize('posts', 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql'
});

const Post = sequelize.define('post', {
    titulo: {
        type: Sequelize.STRING,
        allowNull: true
    },
    descricao:{
        type: Sequelize.STRING,
        allowNull: true
    },
    texto: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    imagem: {
        type: Sequelize.TEXT,
        allowNull: true
    }
});

//Post.sync({ force: true });


module.exports = Post