'use strict';

module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('usuario', {
    nome: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    senha: {
      type: DataTypes.STRING
    },
    eAdmin: {
      type: DataTypes.INTEGER
    }
  });

  return Usuario;
};