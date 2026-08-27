// backend/src/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
// first we are connect mongoDB 
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
// if the connection faila than crash the server
    process.exit(1);
  }
};

module.exports = connectDB;