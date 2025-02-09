require('dotenv').config();
console.log('MONGO_URI from .env:', process.env.MONGO_URI); 

const express = require('express');
const connectDB = require('./db');


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});