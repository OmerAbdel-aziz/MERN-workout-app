import React from "react";

const Card = () => {
  return (
    <div class="w-full flex justify-between items-start p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col">
        <a href="#">
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-blue-600 dark:text-white">
            Noteworthy technology acquisitions 2021
          </h5>
        </a>
        <p class="mb-3 text-gray-700 dark:text-gray-400 font-semibold">
          Load in kg
        </p>
        <p class="mb-3 text-gray-700 dark:text-gray-400 font-semibold">Reps</p>
        <p class="mb-3 text-gray-700 dark:text-gray-400 font-semibold">Date</p>
      </div>

      <a
        href="#"
        class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-400 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Delete
      </a>
    </div>
  );
};

export default Card;
