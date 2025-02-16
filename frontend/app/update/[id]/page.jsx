"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useActionState } from "react";
import { createWorkout } from "../actions/workoutActions"; // ✅ Import Server Action

import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// ✅ Schema Validation
const FormSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Exercise must be at least 2 characters." }),
  load: z.coerce
    .number()
    .min(1, { message: "Load must be a positive number." }),
  reps: z.coerce.number().min(1, { message: "Reps must be at least 1." }),
});

export default function InputForm({ onCreate }) {
  const { toast } = useToast();

  // ✅ Connect form to Server Action
  const [state, formAction] = useActionState(createWorkout, {
    error: null,
    success: null,
  });

  // ✅ Initialize form with default values
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      load: "",
      reps: "",
    },
  });

  async function onSubmit(data) {
    const formData = new FormData(); // ✅ Create a FormData instance

    // ✅ Append fields to FormData
    formData.append("title", data.title);
    formData.append("load", data.load);
    formData.append("reps", data.reps);

    await onCreate(formData); // ✅ Send FormData to parent
    toast({ title: "Workout added successfully!" });
    form.reset(); // ✅ Clear form after submission
  }

  return (
    <div className="border rounded-md shadow-sm w-full p-4 bg-white">
      <h2 className="text-lg font-semibold">Add New Workout</h2>

      {/* ✅ Display success or error messages */}
      {state?.error && <p className="text-red-500">{state.error}</p>}
      {state?.success && <p className="text-green-500">{state.success}</p>}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exercise Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Bench Press" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="load"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Load (kg)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g. 50" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reps"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reps</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g. 10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="bg-blue-600">
            Add Workout
          </Button>
        </form>
      </Form>
    </div>
  );
}
