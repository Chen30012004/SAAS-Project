const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load biến môi trường từ file .env
dotenv.config();

const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware cơ bản
app.use(cors()); // Cho phép cross-origin requests
app.use(express.json()); // Parse body của request sang JSON

app.get('/', (req, res) => {
  res.send('Chào mừng bạn đến với SAAS Backend API!');
});

// Import routes
const packageRoutes = require('./routes/packageRoutes');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const userRoutes = require('./routes/userRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Đăng ký routes
app.use('/api/packages', packageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);

// Health check API
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running normally' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
