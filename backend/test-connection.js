const sequelize = require('./config/db');
const User = require('./models/User');
const Transaction = require('./models/Transaction');

async function test() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Đồng bộ model (không xóa bảng cũ)
    await sequelize.sync({ alter: false });
    console.log('Models synced successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    await sequelize.close();
  }
}

test();
// This code tests the connection to a MySQL database using Sequelize ORM.
// It imports the Sequelize instance and models, attempts to authenticate the connection 