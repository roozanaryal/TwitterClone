import mongoose from "mongoose";
import User from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

const checkAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Find admin user
    const adminUser = await User.findOne({ username: "admin" });
    if (adminUser) {
      console.log("Admin user found:");
      console.log("Username:", adminUser.username);
      console.log("Email:", adminUser.email);
      console.log("isAdmin:", adminUser.isAdmin);
      console.log("ID:", adminUser._id);
    } else {
      console.log("No admin user found");
    }

    // Check all users with admin privileges
    const allAdmins = await User.find({ isAdmin: true });
    console.log("\nAll admin users:", allAdmins.length);
    allAdmins.forEach(admin => {
      console.log(`- ${admin.username} (${admin.email})`);
    });

  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
  }
};

checkAdminUser();
