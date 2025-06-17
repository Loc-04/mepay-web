const Activity = require('../models/Activity');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { Op } = require('sequelize');

exports.getUserActivities = async (req, res) => {
  try {
    const activities = await Activity.findAll({
      where: {
        userId: req.user.id
      },
      order: [['created_at', 'DESC']],
      limit: 50
    });

    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Error fetching activities' });
  }
};

exports.createActivity = async (userId, type, category, amount, description) => {
  try {
    await Activity.create({
      userId,
      type,
      category,
      amount,
      description
    });
  } catch (error) {
    console.error('Error creating activity:', error);
  }
};

// Get all login activities for all users
exports.getAllLoginActivities = async (req, res) => {
  try {
    const activities = await Activity.findAll({
      include: [{ model: User, attributes: ['id', 'account_name', 'email'] }],
      order: [['created_at', 'DESC']]
    });
    res.json(activities);
  } catch (error) {
    console.error('Error fetching login activities:', error);
    res.status(500).json({ message: 'Error fetching login activities' });
  }
};

// Get all transactions for a user
exports.getUserTransactions = async (req, res) => {
  try {
    const userId = req.params.userId;
    const transactions = await Transaction.findAll({
      where: { user_id: userId },
      order: [['date', 'DESC']]
    });
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    res.status(500).json({ message: 'Error fetching user transactions' });
  }
}; 