import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comments.model.js";
import Notification from "../models/notification.model.js";
import mongoose from "mongoose";

// Get comprehensive dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Get current date for time-based queries
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // User statistics
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ isAdmin: true });
    const regularUsers = totalUsers - adminUsers;
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: startOfDay },
    });
    const newUsersThisWeek = await User.countDocuments({
      createdAt: { $gte: startOfWeek },
    });
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    // Post statistics
    const totalPosts = await Post.countDocuments();
    const postsToday = await Post.countDocuments({
      createdAt: { $gte: startOfDay },
    });
    const postsThisWeek = await Post.countDocuments({
      createdAt: { $gte: startOfWeek },
    });
    const postsThisMonth = await Post.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    // Comment statistics
    const totalComments = await Comment.countDocuments();
    const commentsToday = await Comment.countDocuments({
      createdAt: { $gte: startOfDay },
    });

    // Engagement statistics
    const totalLikes = await Post.aggregate([
      { $project: { likesCount: { $size: { $ifNull: ["$likes", []] } } } },
      { $group: { _id: null, total: { $sum: "$likesCount" } } },
    ]);

    const totalBookmarks = await Post.aggregate([
      {
        $project: {
          bookmarksCount: { $size: { $ifNull: ["$bookmarks", []] } },
        },
      },
      { $group: { _id: null, total: { $sum: "$bookmarksCount" } } },
    ]);

    // Most active users (by posts)
    const mostActiveUsers = await Post.aggregate([
      { $group: { _id: "$postOwner", postCount: { $sum: 1 } } },
      { $sort: { postCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          username: "$user.username",
          name: "$user.name",
          profilePicture: "$user.profilePicture",
          postCount: 1,
        },
      },
    ]);

    // Recent activity (last 10 posts)
    const recentPosts = await Post.find()
      .populate("postOwner", "username name profilePicture")
      .sort({ createdAt: -1 })
      .limit(10)
      .select("description createdAt likes comments");

    // Growth data for charts (last 7 days)
    const growthData = await Promise.all(
      Array.from({ length: 7 }, async (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const startOfDay = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate()
        );
        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(endOfDay.getDate() + 1);

        const users = await User.countDocuments({
          createdAt: { $gte: startOfDay, $lt: endOfDay },
        });
        const posts = await Post.countDocuments({
          createdAt: { $gte: startOfDay, $lt: endOfDay },
        });

        return {
          date: startOfDay.toISOString().split("T")[0],
          users,
          posts,
        };
      })
    );

    res.status(200).json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          admins: adminUsers,
          regular: regularUsers,
          newToday: newUsersToday,
          newThisWeek: newUsersThisWeek,
          newThisMonth: newUsersThisMonth,
        },
        posts: {
          total: totalPosts,
          today: postsToday,
          thisWeek: postsThisWeek,
          thisMonth: postsThisMonth,
        },
        engagement: {
          totalComments,
          commentsToday,
          totalLikes: totalLikes[0]?.total || 0,
          totalBookmarks: totalBookmarks[0]?.total || 0,
        },
        mostActiveUsers,
        recentPosts,
        growthData,
      },
    });
  } catch (error) {
    console.error("Error in getDashboardStats:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get system health information
export const getSystemHealth = async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState;
    const dbStatusText =
      {
        0: "disconnected",
        1: "connected",
        2: "connecting",
        3: "disconnecting",
      }[dbStatus] || "unknown";

    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();

    res.status(200).json({
      success: true,
      health: {
        database: {
          status: dbStatusText,
          connected: dbStatus === 1,
        },
        server: {
          uptime: Math.floor(uptime),
          memoryUsage: {
            rss: Math.round(memoryUsage.rss / 1024 / 1024),
            heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
            heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
          },
        },
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error in getSystemHealth:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get user activity analytics
export const getUserAnalytics = async (req, res) => {
  try {
    // User registration trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const registrationTrend = await User.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // User engagement levels
    const userEngagement = await User.aggregate([
      {
        $project: {
          username: 1,
          name: 1,
          followersCount: { $size: { $ifNull: ["$followers", []] } },
          followingCount: { $size: { $ifNull: ["$following", []] } },
          postsCount: { $size: { $ifNull: ["$posts", []] } },
          bookmarksCount: { $size: { $ifNull: ["$bookmarks", []] } },
        },
      },
      {
        $addFields: {
          engagementScore: {
            $add: [
              "$followersCount",
              { $multiply: ["$postsCount", 2] },
              "$bookmarksCount",
            ],
          },
        },
      },
      { $sort: { engagementScore: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        registrationTrend,
        topEngagedUsers: userEngagement,
      },
    });
  } catch (error) {
    console.error("Error in getUserAnalytics:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get content moderation data
export const getContentStats = async (req, res) => {
  try {
    // Posts by length distribution
    const postLengthDistribution = await Post.aggregate([
      {
        $project: {
          length: { $strLenCP: { $ifNull: ["$description", ""] } },
          createdAt: 1,
        },
      },
      {
        $bucket: {
          groupBy: "$length",
          boundaries: [0, 50, 100, 150, 200, 280],
          default: "280+",
          output: {
            count: { $sum: 1 },
            avgLength: { $avg: "$length" },
          },
        },
      },
    ]);

    // Most liked posts
    const topPosts = await Post.aggregate([
      {
        $project: {
          description: 1,
          postOwner: 1,
          likesCount: { $size: { $ifNull: ["$likes", []] } },
          commentsCount: { $size: { $ifNull: ["$comments", []] } },
          createdAt: 1,
        },
      },
      { $sort: { likesCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "postOwner",
          foreignField: "_id",
          as: "owner",
        },
      },
      { $unwind: "$owner" },
      {
        $project: {
          description: 1,
          likesCount: 1,
          commentsCount: 1,
          createdAt: 1,
          owner: {
            username: 1,
            name: 1,
            profilePicture: 1,
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      content: {
        postLengthDistribution,
        topPosts,
      },
    });
  } catch (error) {
    console.error("Error in getContentStats:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Toggle user ad visibility
export const toggleUserAds = async (req, res) => {
  try {
    const { id: userId } = req.params;

    console.log("Toggle ads request for user ID:", userId);

    if (!userId) {
      console.log("No user ID provided");
      return res.status(400).json({ error: "User ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("Invalid user ID format:", userId);
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found for ID:", userId);
      return res.status(404).json({ error: "User not found" });
    }

    console.log("Current user showAds value:", user.showAds);

    // Handle undefined showAds field (set default to true if undefined)
    if (user.showAds === undefined) {
      user.showAds = true;
    }

    // Toggle the showAds field
    user.showAds = !user.showAds;
    await user.save();

    console.log("Updated user showAds value:", user.showAds);

    res.status(200).json({
      success: true,
      message: `Ads ${user.showAds ? "enabled" : "disabled"} for user @${
        user.username
      }`,
      user: {
        _id: user._id,
        username: user.username,
        name: user.name,
        showAds: user.showAds,
      },
    });
  } catch (error) {
    console.error("Error in toggleUserAds:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};
