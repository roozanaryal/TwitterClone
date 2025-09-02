import mongoose from 'mongoose';
import User from '../models/user.model.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const migrateUserAds = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Update all users who don't have the showAds field
    const result = await User.updateMany(
      { showAds: { $exists: false } },
      { $set: { showAds: true } }
    );

    console.log(`Updated ${result.modifiedCount} users with showAds field`);

    // Verify the update
    const totalUsers = await User.countDocuments();
    const usersWithShowAds = await User.countDocuments({ showAds: { $exists: true } });
    
    console.log(`Total users: ${totalUsers}`);
    console.log(`Users with showAds field: ${usersWithShowAds}`);

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateUserAds();
