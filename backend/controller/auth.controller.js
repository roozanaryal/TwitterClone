import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { name, username, password, email } = req.body;
    if (!name || !username || !password || !email) {
      return res.status(400).json({
        message: "All fields are required",
        success: false
      });
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({ 
      $or: [
        { username: { $regex: new RegExp(`^${username.trim()}$`, 'i') } },
        { email: email.toLowerCase().trim() }
      ]
    });

    if (existingUser) {
      const field = existingUser.username.toLowerCase() === username.toLowerCase().trim() ? 'username' : 'email';
      return res.status(400).json({
        message: `${field === 'username' ? 'Username' : 'Email'} already exists`,
        field,
        success: false
      });
    }

    const profilePic = `https://avatar.iran.liara.run/public/boy?username=${username.trim()}`;
    
    // Create user with plain password - the pre-save hook will hash it
    const newUser = new User({
      name: name.trim(),
      username: username.trim().toLowerCase(),
      password: password, // Will be hashed by pre-save hook
      email: email.toLowerCase().trim(),
      profilePic,
    });

    if (newUser) {
      await newUser.save();

      const token = generateToken(newUser._id);
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        profilePicture: newUser.profilePicture,
        token: token,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};

export const login = async (req, res) => {
  try {
    console.log('Login attempt with:', { username: req.body.username });
    const { username, password } = req.body;

    if (!username || !password) {
      console.log('Missing fields:', { username: !!username, password: '***' });
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    console.log('Looking for user in database...');
    const user = await User.findOne({ 
      username: { $regex: new RegExp(`^${username.trim()}$`, 'i') } 
    });
    
    if (!user) {
      console.log('User not found:', username);
      return res.status(400).json({
        message: "Invalid username or password",
      });
    }

    console.log('User found, checking password...');
    
    // Use the model's matchPassword method for consistent comparison
    const isPasswordCorrect = await user.matchPassword(password);
    
    if (!isPasswordCorrect) {
      console.log('Incorrect password for user:', username);
      return res.status(400).json({
        message: "Invalid username or password",
      });
    }
    console.log("User logging in:", {
      id: user._id,
      username: user.username,
      isAdmin: user.isAdmin,
    });

    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(200).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      profilePicture: user.profilePicture,
      isAdmin: user.isAdmin,
      token: token, // Include token in response
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: true,
    });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
