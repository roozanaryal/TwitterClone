import PropTypes from "prop-types";
import Avatar from "react-avatar";
import { FaRegComment, FaHeart } from "react-icons/fa";
import { CiHeart, CiBookmark } from "react-icons/ci";

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
}) => {
  const owner = post.postOwner || {};
  const ownerName = owner.name || owner.fullName || owner.username || "Unknown User";
  const ownerUsername = owner.username || "unknown";
  const ownerAvatar = owner.profilePicture || owner.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(owner.fullName || owner.name || owner.username || "User")}&background=random`;

  const liked = post.likes?.includes(authUserId);
  const bookmarked = post.bookmarks?.includes(authUserId);

  return (
    <div className="border-b border-gray-200 w-full">
      <div className="flex p-4">
        <Avatar src={ownerAvatar} size="40" round={true} />
        <div className="ml-2 flex-1">
          <div className="flex items-center ml-2">
            <h1 className="font-bold">{ownerName}</h1>
            <p className="text-gray-500 text-sm ml-1">
              @{ownerUsername} · {formatTime(post.createdAt)}
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
                onClick={onToggleComment}
              >
                <FaRegComment size="20px" />
              </div>
              <p className="text-sm text-gray-500">{post.comments?.length || 0}</p>
            </div>
            <div className="flex items-center">
              <div 
                className="p-2 hover:bg-red-200 rounded-full cursor-pointer"
                onClick={() => onToggleLike(post._id, liked)}
              >
                {liked ? (
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
                onClick={() => onToggleBookmark(post._id, bookmarked)}
              >
                {bookmarked ? (
                  <CiBookmark size="20px" className="text-blue-500 fill-current" />
                ) : (
                  <CiBookmark size="20px" />
                )}
              </div>
              <p className="text-sm text-gray-500">{post.bookmarks?.length || 0}</p>
            </div>
          </div>

          {/* Comments Section */}
          {showComment && (
            <div className="ml-2 mt-3 border-t pt-3">
              {/* Existing Comments */}
              {post.comments && post.comments.length > 0 ? (
                <div className="mb-4 space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700">Comments ({post.comments.length})</h4>
                  {post.comments.map((comment) => (
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
                  value={commentInput || ""}
                  onChange={(e) => onChangeComment(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-full outline-none focus:border-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      onSubmitComment();
                    }
                  }}
                />
                <button
                  onClick={onSubmitComment}
                  className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 text-sm"
                  disabled={!commentInput?.trim()}
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
  onToggleLike: PropTypes.func.isRequired,
  onToggleBookmark: PropTypes.func.isRequired,
  showComment: PropTypes.bool,
  onToggleComment: PropTypes.func.isRequired,
  commentInput: PropTypes.string,
  onChangeComment: PropTypes.func.isRequired,
  onSubmitComment: PropTypes.func.isRequired,
};

export default Tweet;
