const express = require('express');
const router = express.Router();
const Workout = require('../models/workout'); // Import the Workout model
const auth = require('../middleware/auth');
const controllers = require("../controllers/workoutController");



// @route   POST /workouts
// @desc    Create a new workout
// @access  Private (requires authentication)
router.post('/', controllers.createWorkout );

// @route   GET /workouts
// @desc    Get all workouts for the authenticated user
// @access  Private
router.get('/', controllers.getAllWorkouts);

// @route   GET /workouts/:id
// @desc    Get a single workout by ID
// @access  Private
router.get('/:id', controllers.getSingleWorkout);

// @route   PATCH /workouts/:id
// @desc    Update a workout by ID
// @access  Private
router.patch('/:id', controllers.updateWorkout);

// @route   DELETE /workouts/:id
// @desc    Delete a workout by ID
// @access  Private
router.delete('/:id',  controllers.deleteWorkout);

module.exports = router;