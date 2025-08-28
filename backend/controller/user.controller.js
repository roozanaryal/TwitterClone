import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";

export const updateProfile = async (req, res) => {
  try {
    const { name, bio, profilePicture } = req.body;
    const userId = req.user._id;

    // Validation
    if (name && typeof name !== "string") {
      return res.status(400).json({ error: "Name must be a string" });
    }

    if (bio && typeof bio !== "string") {
      return res.status(400).json({ error: "Bio must be a string" });
    }

    if (name && name.trim().length === 0) {
      return res.status(400).json({ error: "Name cannot be empty" });
    }

    if (name && name.length > 50) {
      return res.status(400).json({ error: "Name must be less than 50 characters" });
    }

    if (bio && bio.length > 160) {
      return res.status(400).json({ error: "Bio must be less than 160 characters" });
    }

    if (profilePicture && typeof profilePicture !== "string") {
      return res.status(400).json({ error: "Profile picture must be a valid URL" });
    }

    // Build update object
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (bio !== undefined) updateData.bio = bio.trim();
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture.trim();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, select: "-password" }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in updateProfile: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateBio = async (req, res) => {
  try {
    const { bio } = req.body;
    const userId = req.user._id;

    if (typeof bio !== "string") {
      return res.status(400).json({ error: "Bio must be a string" });
    }

    if (bio.length > 160) {
      return res
        .status(400)
        .json({ error: "Bio must be less than 160 characters" });
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
      user: updatedUser,
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
      bio: user.bio,
    });
  } catch (error) {
    console.error("Error in getBio: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const currentUser = await User.findById(userId).select("following");

    // Exclude current user + people they already follow
    const excludedIds = [userId, ...currentUser.following];

    // Use aggregation to compute mutual followers
    const users = await User.aggregate([
      {
        $match: {
          _id: { $nin: excludedIds }, // find id that not me & not already following
        },
      },
      {
        // Count how many of my "following" are in their followers (mutual followers)
        $addFields: {
          mutualCount: {
            $size: {
              $setIntersection: ["$followers", currentUser.following],
            },
          },
        },
      },
      {
        // Sort by mutual connections first, then by creation date for consistency
        $sort: { mutualCount: -1, createdAt: -1 },
      },
      { $limit: 5 }, // only return 5 consistent results
      {
        $project: {
          password: 0, // never expose passwords
        },
      },
    ]);

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error in getSuggestedUsers:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getOtherUserProfile = async (req, res) => {
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
        postsCount,
      },
    });
  } catch (error) {
    console.error("Error in getUserProfile: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Follow a user
export const followUser = async (req, res) => {
  try {
    const { id: targetUserId } = req.params;
    const currentUserId = req.user._id;

    // Check if user tries to follow themselves
    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({ error: "You cannot follow yourself" });
    }

    // Check if target user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if already following
    const currentUser = await User.findById(currentUserId);
    if (currentUser.following.includes(targetUserId)) {
      return res
        .status(400)
        .json({ error: "You are already following this user" });
    }

    // Add target user to current user's following list
    await User.findByIdAndUpdate(currentUserId, {
      $push: { following: targetUserId },
    });

    // Add current user to target user's followers list
    await User.findByIdAndUpdate(targetUserId, {
      $push: { followers: currentUserId },
    });

    // Create notification for the followed user
    const notification = new Notification({
      user: targetUserId,
      fromUser: currentUserId,
      type: "follow",
      message: `${currentUser.username} started following you`,
    });

    await notification.save();

    res.status(200).json({
      success: true,
      message: "User followed successfully",
    });
  } catch (error) {
    console.error("Error in followUser: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Unfollow a user
export const unfollowUser = async (req, res) => {
  try {
    const { id: targetUserId } = req.params;
    const currentUserId = req.user._id;

    // Check if user tries to unfollow themselves
    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({ error: "You cannot unfollow yourself" });
    }

    // Check if target user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if not following
    const currentUser = await User.findById(currentUserId);
    if (!currentUser.following.includes(targetUserId)) {
      return res.status(400).json({ error: "You are not following this user" });
    }

    // Remove target user from current user's following list
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { following: targetUserId },
    });

    // Remove current user from target user's followers list
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: currentUserId },
    });

    res.status(200).json({
      success: true,
      message: "User unfollowed successfully",
    });
  } catch (error) {
    console.error("Error in unfollowUser: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Search users
export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    const currentUserId = req.user._id;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const searchQuery = q.trim();

    // Get current user's following list
    const currentUser = await User.findById(currentUserId).select('following');
    const followingIds = currentUser.following || [];

    // Search users by username, fullName, or email
    const users = await User.find({
      _id: { $ne: currentUserId }, // Exclude current user
      $or: [
        { username: { $regex: searchQuery, $options: "i" } },
        { fullName: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
      ],
    })
      .select("-password")
      .limit(10)
      .lean(); // Convert to plain JavaScript objects

    // Add follow status to each user
    const usersWithFollowStatus = users.map(user => ({
      ...user,
      isFollowing: followingIds.some(id => id.toString() === user._id.toString())
    }));

    res.status(200).json({
      success: true,
      users: usersWithFollowStatus,
    });
  } catch (error) {
    console.error("Error in searchUsers: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get current user's profile
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find user by ID and exclude password
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get posts count
    const postsCount = await Post.countDocuments({ postOwner: user._id });

    res.status(200).json({
      success: true,
      user: {
        ...user.toObject(),
        postsCount,
      },
    });
  } catch (error) {
    console.error("Error in getMyProfile: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get user's followers
export const getUserFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId)
      .populate('followers', '-password')
      .select('followers');
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.status(200).json({ users: user.followers });
  } catch (error) {
    console.error("Error in getUserFollowers: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get user's following
export const getUserFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId)
      .populate('following', '-password')
      .select('following');
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.status(200).json({ users: user.following });
  } catch (error) {
    console.error("Error in getUserFollowing: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
