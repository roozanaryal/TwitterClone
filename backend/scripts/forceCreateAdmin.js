import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const forceCreateAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Delete existing admin user if exists
    await User.deleteOne({ username: "admin" });
    console.log("Deleted existing admin user if any");

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
    console.log("Admin user created successfully!");
    console.log("Details:", {
      username: adminUser.username,
      email: adminUser.email,
      isAdmin: adminUser.isAdmin,
      id: adminUser._id
    });

    // Verify the user was created correctly
    const verifyUser = await User.findOne({ username: "admin" });
    console.log("Verification - isAdmin field:", verifyUser.isAdmin);

  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    mongoose.connection.close();
  }
};

forceCreateAdmin();
