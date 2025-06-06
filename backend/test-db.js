const sequelize = require('./config/db');

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection successful.');
    // Keep the process alive
    process.stdin.resume();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection(); 