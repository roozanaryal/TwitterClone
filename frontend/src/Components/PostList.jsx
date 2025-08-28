import { useEffect, forwardRef, useImperativeHandle, useState } from "react";
import Avatar from "react-avatar";
import { FaRegComment, FaHeart } from "react-icons/fa";
import { CiHeart, CiBookmark } from "react-icons/ci";
// import { FaBookmark } from "react-icons/fa";
// import { formatDistanceToNow } from "date-fns";
import useGetPost from "../hooks/useGetPost";
import useLikePost from "../hooks/useLikePost";
import useAddToBookmark from "../hooks/useAddToBookmark";
import useComment from "../hooks/useComment";
import { useAuthContext } from "../context/AuthContext";
import PropTypes from "prop-types";

// Helper function to format time ago
const formatTimeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`;
  return `${Math.floor(diffInSeconds / 2592000)}mo`;
};

const PostList = forwardRef(({ type }, ref) => {
  const { posts: fetchedPosts, isLoading, error, refreshPosts } = useGetPost(type);
  const { authUser } = useAuthContext();
  const { likePost, unlikePost } = useLikePost();
  const { addToBookmark, removeFromBookmark } = useAddToBookmark();
  const { addComment } = useComment();
  const [commentInputs, setCommentInputs] = useState({});
  const [showCommentInput, setShowCommentInput] = useState({});
  const [posts, setPosts] = useState([]);

  // Update local posts when fetchedPosts changes
  useEffect(() => {
    setPosts(fetchedPosts);
  }, [fetchedPosts]);

  // Expose refreshPosts to parent component
  useImperativeHandle(ref, () => ({
    refreshPosts
  }));

  // Refresh posts when type changes
  useEffect(() => {
    refreshPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  // Handle like toggle with optimistic UI
  const handleLike = async (postId, isLiked) => {
    // Optimistic UI update
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post._id === postId) {
          const updatedLikes = isLiked 
            ? post.likes.filter(id => id !== authUser._id)
            : [...(post.likes || []), authUser._id];
          return { ...post, likes: updatedLikes };
        }
        return post;
      })
    );

    try {
      if (isLiked) {
        await unlikePost(postId);
      } else {
        await likePost(postId);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      // Revert optimistic update on error
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post._id === postId) {
            const revertedLikes = isLiked 
              ? [...(post.likes || []), authUser._id]
              : post.likes.filter(id => id !== authUser._id);
            return { ...post, likes: revertedLikes };
          }
          return post;
        })
      );
    }
  };

  // Handle bookmark toggle
  const handleBookmark = async (postId, isBookmarked) => {
    try {
      if (isBookmarked) {
        await removeFromBookmark(postId);
      } else {
        await addToBookmark(postId);
      }
      // No refresh needed for bookmarks as they don't show status in UI yet
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  // Handle comment submission with optimistic UI
  const handleCommentSubmit = async (postId) => {
    const comment = commentInputs[postId];
    if (!comment?.trim()) return;

    // Create optimistic comment
    const optimisticComment = {
      _id: `temp-${Date.now()}`,
      description: comment,
      postOwner: {
        _id: authUser._id,
        username: authUser.username,
        name: authUser.name,
        profilePicture: authUser.profilePicture || ""
      },
      createdAt: new Date().toISOString()
    };

    // Optimistic UI update
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post._id === postId) {
          return { 
            ...post, 
            comments: [...(post.comments || []), optimisticComment]
          };
        }
        return post;
      })
    );

    // Clear input immediately
    setCommentInputs(prev => ({ ...prev, [postId]: "" }));

    try {
      const result = await addComment(postId, comment);
      
      if (result.success) {
        // Replace optimistic comment with real comment data
        setPosts(prevPosts => 
          prevPosts.map(post => {
            if (post._id === postId) {
              const commentsWithoutOptimistic = post.comments.filter(c => c._id !== optimisticComment._id);
              return { 
                ...post, 
                comments: [...commentsWithoutOptimistic, result.data.comment]
              };
            }
            return post;
          })
        );
      } else {
        console.error("Failed to add comment:", result.error);
        // Remove optimistic comment on error
        setPosts(prevPosts => 
          prevPosts.map(post => {
            if (post._id === postId) {
              return { 
                ...post, 
                comments: post.comments.filter(c => c._id !== optimisticComment._id)
              };
            }
            return post;
          })
        );
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      // Remove optimistic comment on error
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post._id === postId) {
            return { 
              ...post, 
              comments: post.comments.filter(c => c._id !== optimisticComment._id)
            };
          }
          return post;
        })
      );
    }
  };

  // Toggle comment input visibility
  const toggleCommentInput = (postId) => {
    setShowCommentInput(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>Error loading posts: {error}</p>
        <button 
          onClick={refreshPosts}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>
          {type === "following" 
            ? "You don't follow anyone yet. Start following users to see their posts here!" 
            : "No posts available yet. Be the first to post something!"
          }
        </p>
      </div>
    );
  }

  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      
      if (diffInMinutes < 1) return "now";
      if (diffInMinutes < 60) return `${diffInMinutes}m`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
      return `${Math.floor(diffInMinutes / 1440)}d`;
    } catch {
      return "now";
    }
  };

  return (
    <div className="w-full">
      {posts.map((post) => (
        <div className="border-b border-gray-200 w-full" key={post._id}>
          <div className="flex p-4">
            <Avatar 
              src={post.postOwner?.profilePicture || post.postOwner?.profilePic || `https://ui-avatars.com/api/?name=${post.postOwner?.name || 'User'}&background=random`}
              size="40" 
              round={true} 
            />
            <div className="ml-2 flex-1">
              <div className="flex items-center ml-2">
                <h1 className="font-bold">{post.postOwner?.name || "Unknown User"}</h1>
                <p className="text-gray-500 text-sm ml-1">
                  @{post.postOwner?.username || "unknown"} · {formatTime(post.createdAt)}
                </p>
              </div>
              <div className="ml-2">
                <p className="mt-1">{post.description}</p>
                {post.content && post.content !== post.description && (
                  <p className="mt-1 text-gray-700">{post.content}</p>
                )}
              </div>
              <div className="flex justify-between my-3 ml-2 max-w-md">
                <div className="flex items-center">
                  <div 
                    className="p-2 hover:bg-blue-200 rounded-full cursor-pointer"
                    onClick={() => toggleCommentInput(post._id)}
                  >
                    <FaRegComment size="20px" />
                  </div>
                  <p className="text-sm text-gray-500">{post.comments?.length || 0}</p>
                </div>
                <div className="flex items-center">
                  <div 
                    className="p-2 hover:bg-red-200 rounded-full cursor-pointer"
                    onClick={() => handleLike(post._id, post.likes?.includes(authUser?._id))}
                  >
                    {post.likes?.includes(authUser?._id) ? (
                      <FaHeart size="20px" className="text-red-500" />
                    ) : (
                      <CiHeart size="20px" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{post.likes?.length || 0}</p>
                </div>
                <div className="flex items-center">
                  <div 
                    className="p-2 hover:bg-blue-200 rounded-full cursor-pointer"
                    onClick={() => handleBookmark(post._id, false)} // TODO: Add bookmark status check
                  >
                    <CiBookmark size="20px" />
                  </div>
                  <p className="text-sm text-gray-500">0</p>
                </div>
              </div>
              
              {/* Comments Section */}
              {showCommentInput[post._id] && (
                <div className="ml-2 mt-3 border-t pt-3">
                  {/* Existing Comments */}
                  {post.comments && post.comments.length > 0 ? (
                    <div className="mb-4 space-y-3">
                      <h4 className="text-sm font-semibold text-gray-700">Comments ({post.comments.length})</h4>
                      {post.comments.map((comment) => (
                        <div key={comment._id} className="flex items-start gap-2">
                          <Avatar
                            src={comment.postOwner?.profilePicture}
                            name={comment.postOwner?.name || comment.postOwner?.username}
                            size="32"
                            round={true}
                          />
                          <div className="flex-1">
                            <div className="bg-gray-100 rounded-lg px-3 py-2">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm">
                                  {comment.postOwner?.name || comment.postOwner?.username}
                                </span>
                                <span className="text-xs text-gray-500">
                                  @{comment.postOwner?.username}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatTimeAgo(comment.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm">{comment.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">No comments yet. Be the first to comment!</p>
                    </div>
                  )}
                  
                  {/* Comment Input */}
                  <div className="flex items-center gap-2">
                    <Avatar
                      src={authUser?.profilePicture || ""}
                      name={authUser?.name || authUser?.username}
                      size="32"
                      round={true}
                    />
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentInputs[post._id] || ""}
                      onChange={(e) => setCommentInputs(prev => ({ ...prev, [post._id]: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-full outline-none focus:border-blue-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleCommentSubmit(post._id);
                        }
                      }}
                    />
                    <button
                      onClick={() => handleCommentSubmit(post._id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 text-sm"
                      disabled={!commentInputs[post._id]?.trim()}
                    >
                      Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

PostList.displayName = "PostList";

PostList.propTypes = {
  type: PropTypes.string.isRequired,
};

export default PostList;
