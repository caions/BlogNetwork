'use strict';

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('post', {
    titulo: {
      type: DataTypes.STRING
    },
    descricao: {
      type: DataTypes.STRING
    },
    texto: {
      type: DataTypes.TEXT
    },
    imagem: {
      type: DataTypes.TEXT
    }
  });

  return Post;
};