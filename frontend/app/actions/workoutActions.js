"use server";

import Workout from "../../../server/models/workout"; // ✅ Use absolute path
import dbConnect from "../../../server/db"; // ✅ Use absolute path
import { revalidatePath } from "next/cache";

// ✅ Fetch all workouts & convert them to JSON-safe objects
export async function fetchWorkouts() {
    await dbConnect();
    const workouts = await Workout.find().sort({ createdAt: -1 }).lean();  

    // ✅ Convert MongoDB `_id` and `createdAt` to strings
    return workouts.map(workout => ({
        ...workout,
        _id: workout._id.toString(), // Convert ObjectId to string
        createdAt: workout.createdAt.toISOString(), // Convert Date to ISO string
        updatedAt: workout.updatedAt.toISOString()
    }));
}

// ✅ Fetch a single workout (Fixed serialization)
export async function fetchWorkoutById(id) {
    await dbConnect();
    const workout = await Workout.findById(id).lean();

    return workout
        ? {
            ...workout,
            _id: workout._id.toString(),
            createdAt: workout.createdAt.toISOString(),
            updatedAt: workout.updatedAt.toISOString(),
        }
        : null;
}

// ✅ Create a new workout
export async function createWorkout(prevState, formData) {
    try {
        await dbConnect();

        // ✅ Extract values from FormData
        const title = formData.get("title");
        const load = Number(formData.get("load"));
        const reps = Number(formData.get("reps"));

        if (!title || isNaN(load) || isNaN(reps)) {
            return { error: "Invalid input data." };
        }

        // ✅ Save the workout
        const newWorkout = new Workout({ title, load, reps });
        await newWorkout.save();

        // ✅ Convert to JSON-safe object
        const safeWorkout = {
            _id: newWorkout._id.toString(), // Convert ObjectId to string
            title: newWorkout.title,
            load: newWorkout.load,
            reps: newWorkout.reps,
            createdAt: newWorkout.createdAt.toISOString(), // Convert Date to string
            updatedAt: newWorkout.updatedAt.toISOString(),
        };

        return { success: "Workout created successfully!", workout: safeWorkout };
    } catch (error) {
        return { error: error.message };
    }
}

// ✅ Update a workout
export async function updateWorkout(prevState, formData) {
    try {
        await dbConnect();
        const { id, title, load, reps } = Object.fromEntries(formData);

        const updatedWorkout = await Workout.findByIdAndUpdate(id, { title, load, reps }, { new: true });

        if (!updatedWorkout) return { error: "Workout not found." };

        revalidatePath("/");
        return { success: "Workout updated successfully!" };
    } catch (error) {
        return { error: error.message };
    }
}

// ✅ Delete a workout
export async function deleteWorkout(prevState, formData) {
    try {
        await dbConnect();
        const { id } = Object.fromEntries(formData);

        const deletedWorkout = await Workout.findByIdAndDelete(id);
        if (!deletedWorkout) return { error: "Workout not found." };

        revalidatePath("/");
        return { success: "Workout deleted successfully!" };
    } catch (error) {
        return { error: error.message };
    }
}
