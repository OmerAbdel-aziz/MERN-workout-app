"use client";

import { useFormState, useFormStatus } from "react-dom";
import { loginUser } from "../../actions/userActions";

// Submit Button component with loading state
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full py-2 rounded-md transition-all duration-200 ${
        pending
          ? "bg-blue-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      } text-white`}
    >
      {pending ? "Signing in..." : "Sign In"}
    </button>
  );
}

const LoginPage = () => {
  const [state, formAction] = useFormState(loginUser, {
    error: null,
    success: null,
  });

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Sign In
        </h1>

        {/* Error Message */}
        {state?.error && (
          <div className="mb-4 p-3 rounded bg-red-50 border border-red-200">
            <p className="text-red-600 text-sm">{state.error}</p>
          </div>
        )}

        {/* Success Message */}
        {state?.success && (
          <div className="mb-4 p-3 rounded bg-green-50 border border-green-200">
            <p className="text-green-600 text-sm">{state.success}</p>
          </div>
        )}

        <form action={formAction} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              autoComplete="email"
              className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <SubmitButton />

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{" "}
            <a
              href="/sign-up"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
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
