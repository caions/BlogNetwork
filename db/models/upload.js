'use strict';

module.exports = (sequelize, DataTypes) => {
  const Upload = sequelize.define('upload', {
    nome: {
      type: DataTypes.STRING
    },
    size: {
      type: DataTypes.INTEGER
    },
    key: {
      type: DataTypes.STRING
    },
    url: {
      type: DataTypes.STRING
    }
  });

  return Upload;
};

