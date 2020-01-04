const Sequelize = require('sequelize');
const sequelize = require('./config')

const Upload = sequelize.define('upload', {
    imagem: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

//Upload.sync({ force: true });

module.exports = Upload