import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("Using existing MongoDB connection");
      return;
    }

    // if (!process.env.MONGO_DB_URI) {
    //     throw new Error("MONGO_DB_URI is not defined in environment variables");
    // }

    const conn = await mongoose.connect(
      process.env.MONGO_DB_URI || "mongodb://localhost:27017/twitter",
      {
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 10s
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      }
    );

    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
