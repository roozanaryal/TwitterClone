import Post from "../models/post.model.js";
import User from "../models/user.model.js";

// Add a post to bookmarks
export const addBookmark = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Check if already bookmarked
    if (user.bookmarks.includes(postId)) {
      return res.status(400).json({
        message: "Post already bookmarked",
      });
    }

    // Add to bookmarks
    user.bookmarks.push(postId);
    await user.save();

    // Also add user to post's bookmarks array
    post.bookmarks.push(userId);
    await post.save();

    res.status(200).json({
      message: "Post bookmarked successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// Remove a post from bookmarks
export const removeBookmark = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check if post is bookmarked
    if (!user.bookmarks.includes(postId)) {
      return res.status(400).json({
        message: "Post not found in bookmarks",
      });
    }

    // Remove from bookmarks
    user.bookmarks = user.bookmarks.filter(id => id.toString() !== postId);
    await user.save();

    // Also remove user from post's bookmarks array
    const post = await Post.findById(postId);
    if (post) {
      post.bookmarks = post.bookmarks.filter(id => id.toString() !== userId);
      await post.save();
    }

    res.status(200).json({
      message: "Post removed from bookmarks",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// Fetch bookmarked posts
export const getBookmarks = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user with populated bookmarks
    const user = await User.findById(userId).populate({
      path: "bookmarks",
      populate: [
        {
          path: "postOwner",
          select: "username name profilePicture"
        },
        {
          path: "comments",
          populate: {
            path: "postOwner",
            select: "username name profilePicture"
          }
        }
      ]
    });
    
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      posts: user.bookmarks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
