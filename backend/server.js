require('dotenv').config();          // Để sử dụng biến môi trường từ file .env
const express = require('express');  // Import express
const cors = require('cors');       // CORS để cho phép frontend kết nối API
const sequelize = require('./config/db'); // Import sequelize từ config/db.js
const authRoutes = require('./routes/auth'); // Import các routes
const transactionRoutes = require('./routes/transaction');
const app = express();              // Khởi tạo express app

app.use(cors({
  origin: 'http://localhost:3000',  // Chỉ cho phép frontend ở port 3000 kết nối
  credentials: true
}));
app.use(express.json());             // Middleware xử lý dữ liệu JSON

// Các route
app.use('/api', authRoutes);          // Route đăng ký, đăng nhập
app.use('/api/transactions', transactionRoutes);  // Route quản lý giao dịch

// Cấu hình cổng
const PORT = process.env.PORT || 5000;  // Port backend

// Kiểm tra kết nối database trước khi chạy server
sequelize.authenticate()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);  // Thêm chi tiết lỗi
    process.exit(1);  // Dừng server nếu không kết nối được DB
  });


  process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
