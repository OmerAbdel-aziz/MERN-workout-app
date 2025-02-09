const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {JWT_SECRET} = require('../config')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// 🔹 Generate JWT Token
userSchema.methods.generateAuthToken = function () {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env file");
  }

  const token = jwt.sign({ _id: this._id }, JWT_SECRET, {
    expiresIn: "1h",
  });

  return token;
};

// 🔹 Find user by email & validate password
userSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("Invalid email or password");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password");

  return user;
};

// 🔹 Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
