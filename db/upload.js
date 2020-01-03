const Sequelize = require('sequelize');

const sequelize = new Sequelize('posts', 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql'
});

const Upload = sequelize.define('upload', {
    imagem: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

//Upload.sync({ force: true });

module.exports = Upload