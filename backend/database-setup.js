const sequelize = require('./config/db');
const User = require('./models/User');
const Transaction = require('./models/Transaction');

/*
Database Schema Management: The file contains the SQL statements that create your database tables. If you ever need to set up the database on a new system or reset it, this file will be valuable.
Testing and Development: The sample data is useful for:
Testing new features
Demonstrating the application to others
Debugging issues
Setting up development environments
Documentation: The file serves as documentation of your database structure and initial data requirements.
*/
async function initializeDatabase() {
  try {
    // Force sync will drop existing tables and recreate them
    // In production, you should use { alter: true } instead
    await sequelize.sync({ force: true });
    console.log('Database tables created successfully');
    
    // Create test user
    const testUser = await User.create({
      account_name: 'Test User',
      email: 'test@example.com',
      password_hash: '$2a$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX5YxX' // This is a dummy hash
    });
    console.log('Test user created:', testUser.email);

    // Create test transaction
    const testTransaction = await Transaction.create({
      user_id: testUser.id,
      amount: 100.00,
      type: 'income',
      category: 'Salary',
      date: new Date(),
      description: 'Test transaction'
    });
    console.log('Test transaction created:', testTransaction.id);

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await sequelize.close();
  }
}

initializeDatabase(); 