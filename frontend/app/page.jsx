"use client";

import { useState, useEffect, useOptimistic, startTransition } from "react";
import {
  fetchWorkouts,
  createWorkout,
  deleteWorkout,
} from "./actions/workoutActions";
import { useActionState } from "react";
import Card from "./components/Card";
import Form from "./components/Form";

export default function Home() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [optimisticWorkouts, addOptimisticWorkout] = useOptimistic(
    workouts,
    (state, newWorkout) => [...state, newWorkout]
  );

  async function loadWorkouts() {
    try {
      const res = await fetch("http://localhost:3000/api/workouts");
      const data = await res.json();
      setWorkouts(data);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWorkouts();
  }, []);

  const handleDelete = (deletedId) => {
    setWorkouts(workouts.filter((workout) => workout._id !== deletedId));
  };

  async function handleCreateWorkout(formData) {
    const result = await createWorkout(null, formData);
    if (result.success && result.workout) {
      startTransition(() => {
        // ✅ Ensures safe state updates
        addOptimisticWorkout(result.workout);
      });
      await loadWorkouts();
    }
  }

  return (
    <div className="flex flex-row w-full bg-slate-100">
      <div className="w-[70%] flex flex-col gap-6 px-10 py-5">
        {loading ? (
          <p>Loading workouts...</p>
        ) : optimisticWorkouts.length === 0 ? (
          <p>No workouts available.</p>
        ) : (
          optimisticWorkouts.map((workout) => (
            <Card key={workout._id} workout={workout} onDelete={handleDelete} />
          ))
        )}
      </div>
      <div className="w-[30%] flex items-start justify-center py-5 pr-10">
        <Form onCreate={handleCreateWorkout} />
      </div>
    </div>
  );
}
