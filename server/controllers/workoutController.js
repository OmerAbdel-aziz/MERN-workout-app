const Workout = require('../models/workout'); 
const mongoose = require("mongoose");


// ✅ Get all workouts (No user filtering)
const getAllWorkouts = async (req, res) => {
    try {
      const workouts = await Workout.find().sort({ createdAt: -1 }); 
      res.status(200).json(workouts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

// ✅ Get a single workout (No user check)
const getSingleWorkout = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Check if `id` is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid workout ID format" });
    }

    const workout = await Workout.findById(id);

    if (!workout) {
      return res.status(404).json({ error: "Workout not found" });
    }

    res.status(200).json(workout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a workout 
const createWorkout = async (req, res) => {
    try {
      const { title, load, reps } = req.body;
  
      const workout = new Workout({
        title,
        load,
        reps
      });
  
      await workout.save();
      res.status(201).json(workout);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}  

// Update workout 
const updateWorkout = async (req, res) => {
    try {
      const { title, load, reps } = req.body;
  
      const workout = await Workout.findByIdAndUpdate(
        req.params.id,
        { title, load, reps },
        { new: true }
      );
  
      if (!workout) {
        return res.status(404).json({ error: 'Workout not found' });
      }
  
      res.status(200).json(workout);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

// Delete a workout
const deleteWorkout = async (req, res) => {
    try {
      const workout = await Workout.findByIdAndDelete(req.params.id);
  
      if (!workout) {
        return res.status(404).json({ error: 'Workout not found' });
      }
  
      res.status(200).json({ message: 'Workout deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createWorkout,
    getAllWorkouts,
    getSingleWorkout,
    updateWorkout,
    deleteWorkout
}
