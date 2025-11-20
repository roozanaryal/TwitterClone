import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true, // Index for faster lookups
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true, // Index for faster lookups
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  coverPicture: {
    type: String,
    default: "",
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: [],
    },
  ],
  bookmarks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: [],
    },
  ],
  isAdmin: {
    type: Boolean,
    default: false,
  },
  showAds: {
    type: Boolean,
    default: true,
  },
  adFreeUntil: {
    type: Date,
    default: null,
  },
  paymentHistory: [{
    type: {
      type: String,
      enum: ['ad_removal'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    esewaRefId: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['completed', 'failed', 'pending'],
      default: 'pending',
    },
  }],
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  const bcrypt = await import('bcryptjs');
  return await bcrypt.default.compare(enteredPassword, this.password);
};

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    const bcrypt = await import('bcryptjs');
    const salt = await bcrypt.default.genSalt(10);
    this.password = await bcrypt.default.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Indexes for efficient queries
userSchema.index({ followers: 1 });
userSchema.index({ following: 1 });

export default mongoose.model("User", userSchema);
