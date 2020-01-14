const db = require('./index');
 db
   .sequelize
   .sync({ force: true })
   .then(() => console.log('done'))