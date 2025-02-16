import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";
import { deleteWorkout } from "../actions/workoutActions";
import { useActionState } from "react";

const Card = ({ workout, onDelete }) => {
  const handleDelete = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/workouts/${workout._id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Failed to delete workout");

      onDelete(workout._id);
    } catch (error) {
      console.error("Error deleting workout:", error);
    }
  };
  return (
    <div className="w-full flex justify-between items-start p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col">
        <a href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-blue-600 dark:text-white">
            {workout.title}
          </h5>
        </a>
        <p className="mb-3 text-gray-700 dark:text-gray-400 font-semibold">
          {workout.load}
        </p>
        <p className="mb-3 text-gray-700 dark:text-gray-400 font-semibold">
          {workout.reps}
        </p>
        <p className="mb-3 text-gray-700 dark:text-gray-400 font-semibold">
          Date
        </p>
      </div>
      <div className="flex gap-2 justify-center items-center">
        <Button
          className="px-3 py-2 text-sm font-medium text-white bg-red-400 rounded-lg hover:bg-red-700"
          onClick={handleDelete}
        >
          Delete
        </Button>

        <Button className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-300 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          <Link href={"/update"}>Update</Link>
        </Button>
      </div>
    </div>
  );
};

export default Card;
