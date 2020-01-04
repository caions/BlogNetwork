const Sequelize = require('sequelize')
const sequelize = require('./config')

const Usuario = sequelize.define('usuario', {
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