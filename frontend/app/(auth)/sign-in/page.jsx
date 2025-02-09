"use client";

import { useActionState } from "react";

import { loginUser } from "../../actions/userActions"; // ✅ Import server action

const LoginPage = () => {
  const [state, formAction] = useActionState(loginUser, { error: null });

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6 dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Sign In
        </h1>
        {state?.error && <p className="text-red-500">{state.error}</p>}

        <form action={formAction} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full p-2 border rounded-md dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full p-2 border rounded-md dark:bg-gray-700"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md"
          >
            Sign In
          </button>
          <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            Doesn't have an account ?{" "}
            <a
              href="/sign-up"
              className="font-medium text-primary-600 hover:underline dark:text-primary-500"
            >
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
