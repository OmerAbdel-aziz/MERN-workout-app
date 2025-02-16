const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  load: {
    type: Number,
    required: true,
  },
  reps: {
    type: Number,
    required: true,
  }, 
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('Workout', workoutSchema);