import { useEffect, forwardRef, useImperativeHandle, useState } from "react";
// import { FaBookmark } from "react-icons/fa";
// import { formatDistanceToNow } from "date-fns";
import useGetPost from "../hooks/useGetPost";
import useLikePost from "../hooks/useLikePost";
import useAddToBookmark from "../hooks/useAddToBookmark";
import useComment from "../hooks/useComment";
import { useAuthContext } from "../context/AuthContext";
import PropTypes from "prop-types";
import Tweet from "./Tweet";

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

  // Handle bookmark toggle with optimistic UI
  const handleBookmark = async (postId, isBookmarked) => {
    // Optimistic UI update
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post._id === postId) {
          const updatedBookmarks = isBookmarked 
            ? (post.bookmarks || []).filter(id => id !== authUser._id)
            : [...(post.bookmarks || []), authUser._id];
          return { ...post, bookmarks: updatedBookmarks };
        }
        return post;
      })
    );

    try {
      if (isBookmarked) {
        await removeFromBookmark(postId);
      } else {
        await addToBookmark(postId);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      // Revert optimistic update on error
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post._id === postId) {
            const revertedBookmarks = isBookmarked 
              ? [...(post.bookmarks || []), authUser._id]
              : (post.bookmarks || []).filter(id => id !== authUser._id);
            return { ...post, bookmarks: revertedBookmarks };
          }
          return post;
        })
      );
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

  const handlePostUpdate = (postId, action, value) => {
    setPosts(prev => prev.map(post => {
      if (post._id === postId) {
        if (action === 'like') {
          return {
            ...post,
            likes: value 
              ? [...(post.likes || []), authUser._id]
              : (post.likes || []).filter(id => id !== authUser._id)
          };
        } else if (action === 'bookmark') {
          return {
            ...post,
            bookmarks: value 
              ? [...(post.bookmarks || []), authUser._id]
              : (post.bookmarks || []).filter(id => id !== authUser._id)
          };
        } else if (action === 'comment') {
          return {
            ...post,
            comments: [...(post.comments || []), value]
          };
        }
      }
      return post;
    }));
  };

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

  return (
    <div className="w-full">
      {posts.length === 0 ? (
        <div className="p-6 text-center text-gray-500">No posts available.</div>
      ) : (
        posts.map((post) => (
          <Tweet
            key={post._id}
            post={{
              ...post,
              postOwner: {
                _id: post.postOwner._id,
                username: post.postOwner.username,
                name: post.postOwner.name || post.postOwner.fullName,
                profilePicture: post.postOwner.profilePicture,
              },
            }}
            enableInteractions={true}
            onPostUpdate={handlePostUpdate}
            // Legacy handlers for backward compatibility
            authUserId={authUser?._id}
            onToggleLike={handleLike}
            onToggleBookmark={handleBookmark}
            showComment={!!showCommentInput[post._id]}
            onToggleComment={() => toggleCommentInput(post._id)}
            commentInput={commentInputs[post._id] || ""}
            onChangeComment={(val) => setCommentInputs(prev => ({ ...prev, [post._id]: val }))}
            onSubmitComment={() => handleCommentSubmit(post._id)}
          />
        ))
      )}
    </div>
  );
});

PostList.displayName = "PostList";

PostList.propTypes = {
  type: PropTypes.string.isRequired,
};

export default PostList;
