import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const validatePassword = (password) => {
  const minLength = 8;
  const maxLength = 16;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);
  
  const errors = [];
  if (password.length < minLength || password.length > maxLength) {
    errors.push(`Password must be between ${minLength} and ${maxLength} characters`);
  }
  if (!hasUpperCase) errors.push("Password must contain at least one uppercase letter");
  if (!hasSpecialChar) errors.push("Password must contain at least one special character");
  
  return errors;
};

// User Signup
export const register = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    if (role === "admin") {
      return res.status(403).json({ 
        message: "Unauthorized role selection" 
      });
    }

    // Only allow user and store_owner roles
    if (role !== "user" && role !== "store_owner") {
      return res.status(400).json({ 
        message: "Invalid role selected" 
      });
    }

    // Validate input
    if (!name || !email || !password || !address || !role) {
      return res.status(400).json({ message: "All fields are required" });

      
    }

    // Additional password validation
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      return res.status(400).json({ message: "Invalid password", errors: passwordErrors });
    }

    // Check if email is already taken
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role,
    });

    // Remove password from response
    const userResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      address: newUser.address,
      role: newUser.role
    };

    res.status(201).json({ 
      message: "User registered successfully", 
      user: userResponse 
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors.map(err => err.message)
      });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// User Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Remove password from response
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.status(200).json({ 
      message: "Login successful", 
      token, 
      user: userResponse 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Current User
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data", error: error.message });
  }
};

// Update Password
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }

    // Validate new password
    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      return res.status(400).json({ message: "Invalid new password", errors: passwordErrors });
    }

    // Get user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating password", error: error.message });
  }
};

// Logout (Client-Side: Just remove the token)
export const logout = (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};