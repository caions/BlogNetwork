const Sequelize = require('sequelize');
const aws = require('aws-sdk')
const fs = require('fs')
const path = require('path')
const {promisify} = require('util')
const s3 = new aws.S3()
const sequelize = require('./config')

const Upload = sequelize.define('upload', {
    name: {
        type: Sequelize.STRING
    },
    size: {
        type: Sequelize.INTEGER
    },
    key: {
        type: Sequelize.STRING
    },
    url: {
        type: Sequelize.STRING
    }

})


Upload.beforeCreate(user => {
    if (!user.dataValues.url) {
        user.dataValues.url = `${process.env.APP_URL}/files/${user.dataValues.key}`
    }
})


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

//Upload.sync({force:true})

module.exports = Upload