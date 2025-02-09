const Workout = require('../models/workout'); 
const auth = require('../middleware/auth'); 


//get all workouts 
const getAllWorkouts = async (req, res) => {
    try {
      // Fetch workouts associated with the authenticated user
      const workouts = await Workout.find({ user: req.user.id }).sort({ createdAt: -1 });
      res.status(200).json(workouts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

//get a single workout 

const getSingleWorkout = async (req, res) => {
    try {
      const workout = await Workout.findOne({ _id: req.params.id, user: req.user.id });
  
      if (!workout) {
        return res.status(404).json({ error: 'Workout not found' });
      }
  
      res.status(200).json(workout);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }


//create a workout 
const createWorkout = async (req, res) => {
    try {
      const { title, load, reps } = req.body;
  
      // Create a new workout
      const workout = new Workout({
        title,
        load,
        reps,
        user: req.user.id, // Associate the workout with the authenticated user
      });
  
      // Save the workout to the database
      await workout.save();
  
      // Send the created workout as a response
      res.status(201).json(workout);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}  

//update workout 
const updateWorkout =  async (req, res) => {
    try {
      const { title, load, reps } = req.body;
  
      // Find the workout and update it
      const workout = await Workout.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id }, // Ensure the workout belongs to the authenticated user
        { title, load, reps },
        { new: true } // Return the updated workout
      );
  
      if (!workout) {
        return res.status(404).json({ error: 'Workout not found' });
      }
  
      res.status(200).json(workout);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }



//delete a workout 

const deleteWorkout =  async (req, res) => {
    try {
      // Find the workout and delete it
      const workout = await Workout.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  
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