import PropTypes from "prop-types";
import Avatar from "react-avatar";
import { FaRegComment, FaHeart } from "react-icons/fa";
import { CiHeart, CiBookmark } from "react-icons/ci";
import { useState } from "react";
import useAPICall from "../api/useAPICall";
import { useAuthContext } from "../context/AuthContext";

// Local time format helpers (kept inside to make component standalone)
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

const Tweet = ({
  post,
  authUserId,
  onToggleLike,
  onToggleBookmark,
  showComment,
  onToggleComment,
  commentInput,
  onChangeComment,
  onSubmitComment,
  // New props for dynamic functionality
  enableInteractions = true,
  onPostUpdate,
}) => {
  const [localPost, setLocalPost] = useState(post);
  const [localCommentInput, setLocalCommentInput] = useState(commentInput || "");
  const [localShowComment, setLocalShowComment] = useState(showComment || false);
  const callAPI = useAPICall();
  const { authUser } = useAuthContext();
  
  // Use auth user ID if not provided
  const userId = authUserId || authUser?._id;
  const owner = localPost.postOwner || {};
  const ownerName = owner.name || owner.fullName || owner.username || "Unknown User";
  const ownerUsername = owner.username || "unknown";
  const ownerAvatar = owner.profilePicture || owner.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(owner.fullName || owner.name || owner.username || "User")}&background=random`;

  const liked = localPost.likes?.includes(userId);
  const bookmarked = localPost.bookmarks?.includes(userId);

  console.log('Tweet component debug:', {
    postId: localPost._id,
    userId,
    enableInteractions,
    liked,
    bookmarked,
    commentsCount: localPost.comments?.length || 0
  });

  // Dynamic API handlers
  const handleLike = async () => {
    if (!enableInteractions || !userId) return;
    
    try {
      const endpoint = liked ? `tweets/unlike/${localPost._id}` : `tweets/like/${localPost._id}`;
      await callAPI(endpoint, 'POST');
      
      // Update local state optimistically
      setLocalPost(prev => ({
        ...prev,
        likes: liked 
          ? prev.likes?.filter(id => id !== userId) || []
          : [...(prev.likes || []), userId]
      }));
      
      // Call parent handler if provided
      if (onToggleLike) {
        onToggleLike(localPost._id, liked);
      }
      
      // Notify parent of post update
      if (onPostUpdate) {
        onPostUpdate(localPost._id, 'like', !liked);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleBookmark = async () => {
    if (!enableInteractions || !userId) {
      console.log('Bookmark disabled:', { enableInteractions, userId });
      return;
    }
    
    try {
      console.log('Bookmark action:', { bookmarked, postId: localPost._id });
      const endpoint = `bookmarks/${localPost._id}`;
      const method = bookmarked ? 'DELETE' : 'POST';
      const response = await callAPI(endpoint, method);
      console.log('Bookmark response:', response);
      
      // Update local state optimistically
      setLocalPost(prev => ({
        ...prev,
        bookmarks: bookmarked 
          ? prev.bookmarks?.filter(id => id !== userId) || []
          : [...(prev.bookmarks || []), userId]
      }));
      
      // Call parent handler if provided
      if (onToggleBookmark) {
        onToggleBookmark(localPost._id, bookmarked);
      }
      
      // Notify parent of post update
      if (onPostUpdate) {
        onPostUpdate(localPost._id, 'bookmark', !bookmarked);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      // Revert optimistic update on error
      setLocalPost(prev => ({
        ...prev,
        bookmarks: bookmarked 
          ? [...(prev.bookmarks || []), userId]
          : prev.bookmarks?.filter(id => id !== userId) || []
      }));
    }
  };

  const handleToggleComment = () => {
    const newShowComment = !localShowComment;
    setLocalShowComment(newShowComment);
    
    // Call parent handler if provided
    if (onToggleComment) {
      onToggleComment();
    }
  };

  const handleCommentSubmit = async () => {
    if (!enableInteractions || !userId || !localCommentInput.trim()) {
      console.log('Comment disabled:', { enableInteractions, userId, input: localCommentInput });
      return;
    }
    
    try {
      console.log('Comment action:', { postId: localPost._id, comment: localCommentInput.trim() });
      const response = await callAPI(`tweets/comment/${localPost._id}`, 'POST', {
        comment: localCommentInput.trim()
      });
      console.log('Comment response:', response);
      
      // Update local state with new comment
      setLocalPost(prev => ({
        ...prev,
        comments: [...(prev.comments || []), response.comment]
      }));
      
      setLocalCommentInput("");
      
      // Call parent handler if provided
      if (onSubmitComment) {
        onSubmitComment();
      }
      
      // Notify parent of post update
      if (onPostUpdate) {
        onPostUpdate(localPost._id, 'comment', response.comment);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleCommentChange = (value) => {
    setLocalCommentInput(value);
    
    // Call parent handler if provided
    if (onChangeComment) {
      onChangeComment(value);
    }
  };

  return (
    <div className="border-b border-gray-200 w-full">
      <div className="flex p-4">
        <Avatar src={ownerAvatar} size="40" round={true} />
        <div className="ml-2 flex-1">
          <div className="flex items-center ml-2">
            <h1 className="font-bold">{ownerName}</h1>
            <p className="text-gray-500 text-sm ml-1">
              @{ownerUsername} · {formatTime(localPost.createdAt)}
            </p>
          </div>
          <div className="ml-2">
            <p className="mt-1">{localPost.description}</p>
            {localPost.content && localPost.content !== localPost.description && (
              <p className="mt-1 text-gray-700">{localPost.content}</p>
            )}
          </div>
          <div className="flex justify-between my-3 ml-2 max-w-md">
            <div className="flex items-center">
              <div 
                className="p-2 hover:bg-blue-200 rounded-full cursor-pointer"
                onClick={handleToggleComment}
              >
                <FaRegComment size="20px" />
              </div>
              <p className="text-sm text-gray-500">{localPost.comments?.length || 0}</p>
            </div>
            <div className="flex items-center">
              <div 
                className="p-2 hover:bg-red-200 rounded-full cursor-pointer"
                onClick={handleLike}
              >
                {liked ? (
                  <FaHeart size="20px" className="text-red-500" />
                ) : (
                  <CiHeart size="20px" />
                )}
              </div>
              <p className="text-sm text-gray-500">{localPost.likes?.length || 0}</p>
            </div>
            <div className="flex items-center">
              <div 
                className="p-2 hover:bg-blue-200 rounded-full cursor-pointer"
                onClick={handleBookmark}
              >
                {bookmarked ? (
                  <CiBookmark size="20px" className="text-blue-500 fill-current" />
                ) : (
                  <CiBookmark size="20px" />
                )}
              </div>
              <p className="text-sm text-gray-500">{localPost.bookmarks?.length || 0}</p>
            </div>
          </div>

          {/* Comments Section */}
          {localShowComment && (
            <div className="ml-2 mt-3 border-t pt-3">
              {/* Existing Comments */}
              {localPost.comments && localPost.comments.length > 0 ? (
                <div className="mb-4 space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700">Comments ({localPost.comments.length})</h4>
                  {localPost.comments.map((comment) => (
                    <div key={comment._id} className="flex items-start gap-2">
                      <Avatar
                        src={comment.postOwner?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.postOwner?.name || comment.postOwner?.username || "User")}&background=random`}
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
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={localCommentInput}
                  onChange={(e) => handleCommentChange(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-full outline-none focus:border-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCommentSubmit();
                    }
                  }}
                />
                <button
                  onClick={handleCommentSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 text-sm"
                  disabled={!localCommentInput?.trim()}
                >
                  Reply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Tweet.propTypes = {
  post: PropTypes.object.isRequired,
  authUserId: PropTypes.string,
  onToggleLike: PropTypes.func,
  onToggleBookmark: PropTypes.func,
  showComment: PropTypes.bool,
  onToggleComment: PropTypes.func,
  commentInput: PropTypes.string,
  onChangeComment: PropTypes.func,
  onSubmitComment: PropTypes.func,
  enableInteractions: PropTypes.bool,
  onPostUpdate: PropTypes.func,
};

export default Tweet;
