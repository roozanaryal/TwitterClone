import User from "../models/user.model.js";
import Post from "../models/post.model.js";

export const updateBio = async (req, res) => {
  try {
    const { bio } = req.body;
    const userId = req.user._id;
    
    if (typeof bio !== 'string') {
      return res.status(400).json({ error: "Bio must be a string" });
    }
    
    if (bio.length > 160) {
      return res.status(400).json({ error: "Bio must be less than 160 characters" });
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { bio: bio.trim() },
      { new: true, select: "-password" }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.status(200).json({
      success: true,
      message: "Bio updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Error in updateBio: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getBio = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const user = await User.findById(userId).select("bio");
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.status(200).json({
      success: true,
      bio: user.bio
    });
  } catch (error) {
    console.error("Error in getBio: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get users that the current user is not following and is not the current user
    const users = await User.find({
      _id: { $ne: userId },
      followers: { $ne: userId }
    })
    .select("-password")
    .limit(5);
    
    res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    console.error("Error in getSuggestedUsers: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    
    // Find user by username and exclude password
    const user = await User.findOne({ username }).select("-password");
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Get posts count
    const postsCount = await Post.countDocuments({ postOwner: user._id });
    
    res.status(200).json({
      success: true,
      user: {
        ...user.toObject(),
        postsCount
      }
    });
  } catch (error) {
    console.error("Error in getUserProfile: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
