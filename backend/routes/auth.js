const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

// Đăng ký tài khoản
router.post('/register', async (req, res) => {
  try {
    const { account_name, email, password } = req.body;
    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    // Tạo user mới
    const user = await User.create({ account_name, email, password_hash });
    return res.status(201).json({ message: 'Đăng ký thành công', userId: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Route Đăng nhập
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Tìm user theo email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Email không tồn tại' });
    }
    // So sánh password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Sai mật khẩu' });
    }
    // Nếu đúng, tạo JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    // Trả về thông tin user + token
    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user.id,
        account_name: user.account_name,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;
