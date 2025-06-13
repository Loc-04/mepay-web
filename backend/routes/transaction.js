const express = require('express');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

const router = express.Router();
// Middleware để xác thực người dùng (có thể sử dụng JWT hoặc session)
// 1. CREATE: Thêm giao dịch mới
router.post('/', async (req, res) => {
  try {
    const { user_id, amount, type, category, date, description } = req.body;
    const transaction = await Transaction.create({ user_id, amount, type, category, date, description });

    // Convert amount from string (money) to number for the new transaction
    let newAmount = transaction.amount;
    if (typeof newAmount === 'string') {
      newAmount = newAmount.replace(/[^0-9.-]+/g, '');
      newAmount = newAmount.replace(/,/g, '');
      newAmount = parseFloat(newAmount);
    }
    const formattedTransaction = { ...transaction.toJSON(), amount: newAmount };

    res.status(201).json({ message: 'Thêm giao dịch thành công', transaction: formattedTransaction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// 2. READ: Lấy danh sách giao dịch theo user_id
router.get('/:user_id', async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const transactions = await Transaction.findAll({
      where: { user_id },
      order: [['date', 'DESC']]
    });

    // Convert amount from string (money) to number for each transaction
    const formattedTransactions = transactions.map(t => {
      
      let amount = t.amount;
      if (typeof amount === 'string') {
        // Remove everything except digits, dot, and minus
        amount = amount.replace(/[^0-9.-]+/g, '');
        // Remove commas (in case of "1,000.00")
        amount = amount.replace(/,/g, '');
        amount = parseFloat(amount);
      }
      return { ...t.toJSON(), amount };
    });

    res.json(formattedTransactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// 3. UPDATE: Sửa giao dịch (theo id)
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { amount, type, category, date, description } = req.body;
    const [updated] = await Transaction.update(
      { amount, type, category, date, description },
      { where: { id } }
    );
    if (updated) {
      const updatedTransaction = await Transaction.findByPk(id);
      res.json({ message: 'Cập nhật thành công', transaction: updatedTransaction });
    } else {
      res.status(404).json({ message: 'Không tìm thấy giao dịch' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// 4. DELETE: Xóa giao dịch
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Transaction.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: 'Đã xóa giao dịch' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy giao dịch' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;