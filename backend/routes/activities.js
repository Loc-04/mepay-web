const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const auth = require('../middleware/auth');

router.get('/', auth, activityController.getUserActivities);
router.get('/all-login-activities', auth, activityController.getAllLoginActivities);
router.get('/user/:userId/transactions', auth, activityController.getUserTransactions);

module.exports = router; 