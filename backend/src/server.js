const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Environment variables load 
dotenv.config();

// we are connect Database 
connectDB();

const app = express();
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/candidates', require('./routes/candidateRoutes'));

// the is  Global Middlewares to check the request and response
// CORS setup to allow requests from frontend 
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true 
}));

app.use(express.json());
// for read jwt token from cookies
app.use(cookieParser());


app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Recruitment API is running smoothly!' });
});




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