const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Environment variables load 
dotenv.config();

// Connect Database 
connectDB();

const app = express();

// 1. Sabse pehle Global Middlewares lagao
app.use(cors({
  origin: 'http://localhost:5173', // yahan extra space thi, woh hata di hai
  credentials: true 
}));

app.use(express.json());
app.use(cookieParser());

// 2. Phir Routes ko mount karo (Middlewares ke baad)
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/candidates', require('./routes/candidateRoutes'));

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Recruitment API is running smoothly!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});