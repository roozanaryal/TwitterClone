import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comments.model.js";
import Notification from "../models/notification.model.js";

// Create a new tweet
export const createTweet = async (req, res) => {
  try {
    const { description } = req.body;
    const userId = req.user.id;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Create new post
    const newPost = new Post({
      postOwner: userId,
      description,
      // content,
    });

    // Save post
    const savedPost = await newPost.save();

    // Add post to user's posts
    user.posts.push(savedPost._id);
    await user.save();

    // Get post with user info
    const postWithUser = await Post.findById(savedPost._id).populate(
      "postOwner",
      "username name profilePicture"
    );

    res.status(201).json({
      message: "Tweet created successfully",
      tweet: postWithUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// Get posts for feed
export const getPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const { section = "foryou" } = req.query;

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    let posts = [];

    if (section === "foryou") {
      // Get posts from followed users and self
      const followingIds = [
        ...user.following.map((id) => id.toString()),
        userId,
      ];
      posts = await Post.find({
        postOwner: { $in: followingIds },
      })
        .populate("postOwner", "username name profilePicture")
        .sort({ createdAt: -1 })
        .limit(20);
    } else {
      // Get all posts for explore
      posts = await Post.find()
        .populate("postOwner", "username name profilePicture")
        .sort({ createdAt: -1 })
        .limit(20);
    }

    res.status(200).json({
      posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// Get posts from followed users
export const getFollowingFeed = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's following list
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Get posts from followed users
    const followingIds = [...user.following.map((id) => id.toString()), userId];
    const posts = await Post.find({
      postOwner: { $in: followingIds },
    })
      .populate("postOwner", "username name profilePicture")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// Get my posts
export const getMyPosts = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's posts
    const posts = await Post.find({ postOwner: userId })
      .populate("postOwner", "username name profilePicture")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// Get user's posts by user ID
export const getOtherUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user's posts
    const posts = await Post.find({ postOwner: userId })
      .populate("postOwner", "username name profilePicture")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// Like a post
export const likePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user.id;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Check if user has already liked the post
    if (post.likes.includes(userId)) {
      return res.status(400).json({
        message: "Post already liked",
      });
    }

    // Add user to likes array
    post.likes.push(userId);
    await post.save();
    
    // Create notification for post owner (if it's not their own post)
    if (post.postOwner.toString() !== userId) {
      const postOwner = await User.findById(post.postOwner);
      const liker = await User.findById(userId);
      
      if (postOwner && liker) {
        const message = `${liker.username} liked your post`;
        
        const notification = new Notification({
          user: post.postOwner,
          fromUser: userId,
          type: "like",
          message: message,
          relatedPost: postId,
        });
        
        await notification.save();
      }
    }

    res.status(200).json({
      message: "Post liked successfully",
      likesCount: post.likes.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// Unlike a post
export const unlikePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user.id;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Check if user has liked the post
    if (!post.likes.includes(userId)) {
      return res.status(400).json({
        message: "Post not liked yet",
      });
    }

    // Remove user from likes array
    post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    await post.save();
    
    // Optionally remove notification (not implemented for simplicity)

    res.status(200).json({
      message: "Post unliked successfully",
      likesCount: post.likes.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
    if (post.postOwner.toString() !== userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    await post.deleteOne();
    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.postOwner.toString() !== userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Update only provided fields
    if (req.body.description !== undefined) {
      post.description = req.body.description;
    }
    // if (req.body.content !== undefined) {
    //   post.content = req.body.content;
    // }

    await post.save();

    res.status(200).json({
      message: "Post updated successfully",
      updatedPost: post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const addComment = async (req, res) => {
  const { comment } = req.body;
  const userId = req.user.id;
  const { id: postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found for commenting",
      });
    }
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found for commenting",
      });
    }
    const newComment = new Comment({
      postOwner: userId,
      post: postId,
      description: comment,
    });
    await newComment.save();
    post.comments.push(newComment._id);
    await post.save();
    
    // Create notification for post owner (if it's not their own post)
    if (post.postOwner.toString() !== userId) {
      const postOwner = await User.findById(post.postOwner);
      const commenter = await User.findById(userId);
      
      if (postOwner && commenter) {
        const message = `${commenter.username} commented on your post`;
        
        const notification = new Notification({
          user: post.postOwner,
          fromUser: userId,
          type: "comment",
          message: message,
          relatedPost: postId,
          relatedComment: newComment._id,
        });
        
        await notification.save();
      }
    }
    
    res.status(200).json({
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const deleteComment = async (req, res) => {
  const { id: commentId } = req.params;
  const userId = req.user.id;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }
    if (comment.postOwner.toString() !== userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    await comment.deleteOne();
    res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
