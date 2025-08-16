import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";

// Create a notification
export const createNotification = async (req, res) => {
  try {
    const { userId, fromUserId, type, relatedPostId, relatedCommentId } = req.body;
    
    // Validate required fields
    if (!userId || !fromUserId || !type) {
      return res.status(400).json({
        message: "userId, fromUserId, and type are required",
      });
    }
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    
    // Check if fromUser exists
    const fromUser = await User.findById(fromUserId);
    if (!fromUser) {
      return res.status(404).json({
        message: "From user not found",
      });
    }
    
    // Check if post exists (if relatedPostId is provided)
    let post = null;
    if (relatedPostId) {
      post = await Post.findById(relatedPostId);
      if (!post) {
        return res.status(404).json({
          message: "Post not found",
        });
      }
    }
    
    // Generate message based on type
    let message = "";
    switch (type) {
      case "like":
        message = `${fromUser.username} liked your post`;
        break;
      case "comment":
        message = `${fromUser.username} commented on your post`;
        break;
      case "follow":
        message = `${fromUser.username} started following you`;
        break;
      default:
        message = `${fromUser.username} ${type}ed`;
    }
    
    // Create notification
    const notification = new Notification({
      user: userId,
      fromUser: fromUserId,
      type,
      message,
      relatedPost: relatedPostId || null,
      relatedComment: relatedCommentId || null,
    });
    
    await notification.save();
    
    res.status(201).json({
      message: "Notification created successfully",
      notification,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// Get notifications for a user
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const notifications = await Notification.find({ user: userId })
      .populate("fromUser", "username name profilePicture")
      .populate("relatedPost", "description")
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.status(200).json({
      notifications,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id: notificationId } = req.params;
    const userId = req.user.id;
    
    const notification = await Notification.findOne({
      _id: notificationId,
      user: userId,
    });
    
    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }
    
    notification.isRead = true;
    await notification.save();
    
    res.status(200).json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    
    await Notification.updateMany(
      { user: userId, isRead: false },
      { isRead: true }
    );
    
    res.status(200).json({
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const { id: notificationId } = req.params;
    const userId = req.user.id;
    
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      user: userId,
    });
    
    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }
    
    res.status(200).json({
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// Get unread notifications count
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const count = await Notification.countDocuments({
      user: userId,
      isRead: false,
    });
    
    res.status(200).json({
      count,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
