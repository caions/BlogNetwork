'use strict';

const Sequelize = require('sequelize');
const PostModel = require('./models/post');
const UsuarioModel = require('./models/usuario');
const UploadModel = require('./models/upload');
const aws = require('aws-sdk')
const fs = require('fs')
const path = require('path')
const {promisify} = require('util')
const s3 = new aws.S3()
/*
const sequelize = new Sequelize('blogNetwork', 'root', '123456', {
  host: 'localhost',
  dialect: 'mysql'
});*/ 

// JawsDB
const sequelize = new Sequelize(process.env.JAWSDB_DATABASE_NAME, process.env.JAWSDB_USERNAME, process.env.JAWSDB_PASS, {
host: process.env.JAWSDB_HOST,
dialect: 'mysql'
});

const Post = PostModel(sequelize, Sequelize);
const Usuario = UsuarioModel(sequelize, Sequelize);
const Upload = UploadModel(sequelize, Sequelize);

Upload.beforeDestroy(user => {
if(process.env.STORAGE_TYPE === 's3'){
    console.log('deletado')
    return s3.deleteObject({
        Bucket: 'uploadcaions',
        Key: user.dataValues.key,
    }).promise()
} else{
    return promisify(fs.unlink)(path.resolve(__dirname,'../tmp/uploads',user.dataValues.key))
}
})

Upload.hasOne(Post, {
  foreignKey: 'fk_imagem'
});

module.exports = {
  sequelize,
  Sequelize,
  Post,
  Usuario,
  Upload
}