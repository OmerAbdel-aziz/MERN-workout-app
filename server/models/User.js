const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require('../config');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,  // This automatically creates an index
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
},
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false  // Don't include password in queries by default
  },
  passwordVersion: {
    type: Number,
    default: 1
  },
  lastPasswordChange: {
    type: Date,
    default: Date.now
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Virtual field for password reset token expiry
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Generate JWT Token
userSchema.methods.generateAuthToken = function() {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      version: this.passwordVersion
    },
    JWT_SECRET,
    {
      expiresIn: "1h",
      algorithm: "HS256"
    }
  );
};

// Find user by credentials with rate limiting
userSchema.statics.findByCredentials = async function(email, password) {
  const user = await this.findOne({ email }).select('+password');
  
  if (!user || !user.isActive) {
    throw new Error("Invalid email or password");
  }

  // Check account lock
  if (user.isLocked) {
    throw new Error("Account is temporarily locked. Please try again later");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  
  if (!isMatch) {
    // Increment login attempts
    user.loginAttempts += 1;
    
    // Lock account if too many attempts
    if (user.loginAttempts >= 5) {
      user.lockUntil = Date.now() + 15 * 60 * 1000; // Lock for 15 minutes
    }
    
    await user.save();
    throw new Error("Invalid email or password");
  }

  // Reset login attempts on successful login
  if (user.loginAttempts > 0 || user.lockUntil) {
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();
  }

  return user;
};

// Hash password middleware
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordVersion += 1;
    this.lastPasswordChange = Date.now();
    next();
  } catch (error) {
    next(error);
  }
});

// Clean response data
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.loginAttempts;
  delete userObject.lockUntil;
  delete userObject.__v;
  return userObject;
};

const User = mongoose.model("User", userSchema);
module.exports = User;