import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";

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
        // Randomize a bit but prioritize mutuals
        $sort: { mutualCount: -1, createdAt: -1 },
      },
      { $sample: { size: 10 } }, // randomize from top candidates
      { $limit: 5 }, // only return 5
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
