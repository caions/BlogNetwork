const Sequelize = require('sequelize')

const sequelize = new Sequelize('posts', 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql'
});

const Usuario = sequelize.define('usuaria', {
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false
    },
    eAdmin: {
        type: Sequelize.INTEGER,
        default: 0
    }
});

//Usuario.sync({force:true})

module.exports = Usuario