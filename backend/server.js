require('dotenv').config();          // Để sử dụng biến môi trường từ file .env
const express = require('express');  // Import express
const cors = require('cors');       // CORS để cho phép frontend kết nối API
const sequelize = require('./config/db'); // Import sequelize từ config/db.js
const authRoutes = require('./routes/auth'); // Import các routes
const transactionRoutes = require('./routes/transaction');
const activityRoutes = require('./routes/activities');
const app = express();              // Khởi tạo express app

app.use(cors({
  origin: 'http://localhost:3000',  // Chỉ cho phép frontend ở port 3000 kết nối
  credentials: true
}));
app.use(express.json());             // Middleware xử lý dữ liệu JSON

// Các route
app.use('/api', authRoutes);          // Route đăng ký, đăng nhập
app.use('/api/transactions', transactionRoutes);  // Route quản lý giao dịch
app.use('/api/activities', activityRoutes);  // Route quản lý hoạt động

// Cấu hình cổng
const PORT = parseInt(process.env.PORT) || 3001;  // Port backend

// Kiểm tra kết nối database trước khi chạy server
sequelize.authenticate()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    }).on('error', (err) => {
      if (err.code === 'EACCES') {
        console.error(`Port ${PORT} requires elevated privileges. Try using a port number above 1024.`);
      } else if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Try a different port.`);
      } else {
        console.error('Server error:', err);
      }
      process.exit(1);
    });
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
    process.exit(1);
  });


  process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
