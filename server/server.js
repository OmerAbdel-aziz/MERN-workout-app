require('dotenv').config();
const workoutRoutes = require('./routes/workouts');
const authRoutes = require('./routes/auth')
const express = require('express');
const connectDB = require('./db');
const app = express();
const PORT = process.env.PORT || 3000;
const {JWT_SECRET} = require('./config');

// Middleware

app.use(express.json());

// Connect to MongoDB
// Connect to MongoDB and start the server
const startServer = async () => {
  try {
    await connectDB(); // Wait for the database connection
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error.message);
    process.exit(1); // Exit the process if the server fails to start
  }
};

// Start the server
startServer();

app.use('/api/workouts', workoutRoutes);
app.use('/api', authRoutes);