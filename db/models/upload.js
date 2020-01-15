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
  Upload.beforeCreate(user => {
    if (!user.dataValues.url) {
        user.dataValues.url = `${process.env.APP_URL}/files/${user.dataValues.key}`
    }
  })
  return Upload;
};

