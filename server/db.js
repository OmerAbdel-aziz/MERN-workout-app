const mongoose = require('mongoose');
require('dotenv').config();
const { MONGO_URI } = require('./config');

const connectDB = async () => {
  try { 
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1); // Exit the process if the connection fails
  }
};

module.exports = connectDB;