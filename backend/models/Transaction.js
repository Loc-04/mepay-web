const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

// Define the transaction type enum values
const TRANSACTION_TYPES = ['income', 'expense'];

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  type: {
    type: DataTypes.STRING, // Changed from ENUM to  for PostgreSQL compatibility
    allowNull: false,
    validate: {
      isIn: [TRANSACTION_TYPES] // Validate against allowed values
    }
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'transactions',
  timestamps: false
});

// Thiết lập quan hệ: mỗi Transaction thuộc về một User
Transaction.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Transaction, { foreignKey: 'user_id' });

module.exports = Transaction;
// This code defines a Transaction model for a Sequelize ORM instance connected to a MySQL database.
// The model includes fields for transaction ID, user ID, amount, type (income or expense), category, date, and description.