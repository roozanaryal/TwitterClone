import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { name, username, password, email } = req.body;
    if (!name || !username || !password || !email || !req.body) {
      return res.status(400).json({
        message: "All fields are required",
        error: error.message,
      });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }
    const profilePic = `http://avatar.iran.liara.run/public/boy?${username}`;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      username,
      password: hashedPassword,
      profilePic,
      email,
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
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        message: "Invalid username or password",
      });
    }
    
    console.log("Found user:", {
      username: user.username,
      isAdmin: user.isAdmin,
      hasIsAdminField: user.hasOwnProperty('isAdmin')
    });

    const isPasswordCorrect = await bcrypt.compare(password, user?.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid username or password",
      });
    }
    console.log("User logging in:", {
      id: user._id,
      username: user.username,
      isAdmin: user.isAdmin
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
      message: "Logged out successfully" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Internal Server Error" 
    });
  }
};
