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
const sequelize = new Sequelize('myq4eompg0hr4xrj', 'flv4ons388k5kdk6', 'p3bfe7bqk4dhkjtw', {
host: 'o61qijqeuqnj9chh.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
dialect: 'mysql'
});

const Post = PostModel(sequelize, Sequelize);
const Usuario = UsuarioModel(sequelize, Sequelize);
const Upload = UploadModel(sequelize, Sequelize);
/*
Upload.beforeCreate(user => {
  if (!user.dataValues.url) {
      user.dataValues.url = `${process.env.APP_URL}/files/${user.dataValues.key}`
  }
})*/

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
/*
Upload.findAll({
  attributes: ['url'],
  include: [{
    model: Post,
    required: true
   ,attributes: ['id','titulo'],}]
}).then(posts => {
  console.log("All users:", JSON.stringify(posts, null, 4));
});
*/

module.exports = {
  sequelize,
  Sequelize,
  Post,
  Usuario,
  Upload
}