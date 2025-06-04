const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('mepay_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});
module.exports = sequelize;
// This code creates a Sequelize instance to connect to a MySQL database named 'mepay_db'.