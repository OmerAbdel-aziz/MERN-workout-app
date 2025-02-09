"use server"; // ✅ Ensure this runs on the server

import { cookies } from "next/headers";
import User from "../../../server/models/User"; 
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dbConnect from "../../../server/db"; 
import { redirect } from "next/navigation";
import {JWT_SECRET} from "../../../server/config"

export async function loginUser(prevState, formData) {
  try {
    await dbConnect(); // Ensure database is connected

    const email = formData.get("email");
    const password = formData.get("password");

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return { error: "Invalid email or password" };

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return { error: "Invalid email or password" };

    // Generate JWT token
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Store token in HTTP-only cookie (more secure)
    const cookieStore = await cookies(); // ✅ Await the cookies API
     cookieStore.set("authToken", token, { httpOnly: true, secure: true });

    // Redirect after login success
    redirect("/");
  } catch (error) {
    return { error };
  }
}

 

export async function registerUser(prevState, formData) {
  try {
    await dbConnect(); // Ensure database is connected

    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return { error: "User already exists" };

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Store JWT in HTTP-only cookie
    const cookieStore = await cookies(); // ✅ Await the cookies API
    cookieStore.set("authToken", token, { httpOnly: true, secure: true });


     // Redirect after sign up success
    redirect("/");

    return { success: "Registration successful! Redirecting..." };
  } catch (error) {
    return { error: "Something went wrong. Please try again later." };
  }
}
