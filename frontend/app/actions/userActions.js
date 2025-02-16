"use server";

import { cookies } from "next/headers";
import User from "../../../server/models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dbConnect from "../../../server/db";
import { redirect } from "next/navigation";
import { JWT_SECRET } from "../../../server/config";

// Validation helpers
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password.length >= 6;
};

 

export async function loginUser(prevState, formData) {
    try {
      await dbConnect();
  
      const email = formData.get("email");
      const password = formData.get("password");
  
      if (!email || !password) {
        return { error: "Email and password are required." };
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return { error: "Invalid email or password." };
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return { error: "Invalid email or password." };
      }
  
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "1h",
      });
  
      const cookieStore = await cookies();
      cookieStore.set("authToken", token, { 
        httpOnly: true, 
        secure: true 
      });

      // Redirect to homepage after successful login
      redirect("/");
  
    } catch (error) {
      console.error("Login Error:", error);
      return { error: "Authentication failed. Please try again." };
    }
}
export async function registerUser(prevState, formData) {
  try {
    await dbConnect();

    const name = formData.get("name")?.trim();
    const email = formData.get("email")?.toLowerCase().trim();
    const password = formData.get("password");

    // Enhanced validation
    if (!name || !email || !password) {
      return { error: "All fields are required." };
    }

    if (!validateEmail(email)) {
      return { error: "Please enter a valid email address." };
    }

    if (!validatePassword(password)) {
      return { error: "Password must be at least 6 characters long." };
    }

    // Check existing user with case-insensitive query
    const existingUser = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, 'i') }
    });

    if (existingUser) {
      return { error: "An account with this email already exists." };
    }

    // Hash password with appropriate cost factor
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with additional security fields
    const user = new User({
      name,
      email,
      password: hashedPassword,
      passwordVersion: 1,
      lastPasswordChange: new Date()
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        version: 1
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
        algorithm: "HS256"
      }
    );

    // Set secure cookie
    const cookieStore = cookies();
    cookieStore.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60
    });
    // redirect("/");

    return {
      success: true,
      user: {
        name: user.name,
        email: user.email
      }
    };

   

  } catch (error) {
    console.error("Registration Error:", error);
    return { error: "Registration failed. Please try again." };
  }
}

// Utility function to get current user from token
export async function getCurrentUser() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("authToken");

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token.value, JWT_SECRET);
    const user = await User.findById(decoded._id).select('-password');

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
}