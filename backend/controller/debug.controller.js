import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const createAdminUser = async (req, res) => {
  try {
    // Delete existing admin user if exists
    await User.deleteOne({ username: "admin" });

    // Create new admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    const adminUser = new User({
      name: "Admin User",
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,
      isAdmin: true,
      profilePicture: `http://avatar.iran.liara.run/public/boy?admin`
    });

    await adminUser.save();

    // Verify the user was created correctly
    const verifyUser = await User.findOne({ username: "admin" });
    
    res.status(200).json({
      message: "Admin user created successfully",
      user: {
        username: verifyUser.username,
        email: verifyUser.email,
        isAdmin: verifyUser.isAdmin,
        id: verifyUser._id
      }
    });
  } catch (error) {
    console.error("Error creating admin user:", error);
    res.status(500).json({ error: "Failed to create admin user" });
  }
};

export const checkUser = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      hasIsAdminField: user.hasOwnProperty('isAdmin'),
      id: user._id
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to check user" });
  }
};
