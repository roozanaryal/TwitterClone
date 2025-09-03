import { IoMdArrowBack } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import Avatar from "react-avatar";
import { useState, useEffect } from "react";
import Tweet from "./Tweet";
import { useAuthContext } from "../hooks/useAuthContext";
import useGetOtherUserProfile from "../hooks/useGetOtherUserProfile";
import useAPICall from "../api/useAPICall";
import FollowersModal from "./FollowersModal";
import EditProfileModal from "./EditProfileModal";

const Profile = () => {
  const { username } = useParams();
  const { authUser } = useAuthContext();
  const { getUserProfile: getOtherProfile } = useGetOtherUserProfile();
  const callAPI = useAPICall();
  
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('followers');
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  // Local state for per-post UI actions
  const [commentInputs, setCommentInputs] = useState({});
  const [showCommentInput, setShowCommentInput] = useState({});
  
  const isOwnProfile = !username || username === authUser?.username;

  // Track if data has been fetched to prevent infinite loops
  const [hasFetched, setHasFetched] = useState(false);

  // Reset hasFetched when username changes
  useEffect(() => {
    setHasFetched(false);
    setUser(null);
    setUserPosts([]);
  }, [username]);

  // Fetch user profile and posts
  useEffect(() => {
    if (!authUser || hasFetched) return;
    
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching profile data for:', username || authUser?.username);
        console.log('Is own profile:', isOwnProfile);
        
        // Fetch user profile
        let profileResult;
        if (isOwnProfile) {
          console.log('Fetching own profile...');
          // Use the /me endpoint for own profile
          const data = await callAPI('users/me', 'GET');
          profileResult = { success: true, data };
        } else {
          console.log('Fetching other profile...');
          profileResult = await getOtherProfile(username);
        }

        console.log('Profile result:', profileResult);

        if (profileResult.success) {
          setUser(profileResult.data.user);
          setIsFollowing(profileResult.data.user?.followers?.includes(authUser?._id));
        } else {
          setError(profileResult.error);
          console.error('Profile fetch error:', profileResult.error);
        }

        // Fetch user posts
        try {
          console.log('Fetching posts for user:', username || authUser?.username);
          let postsResult;
          if (isOwnProfile) {
            postsResult = await callAPI('tweets/getmyposts', 'GET');
          } else {
            // Find user by username first to get their ID
            const targetUser = profileResult.data.user;
            postsResult = await callAPI(`tweets/user/${targetUser._id}`, 'GET');
          }
          console.log('Posts result:', postsResult);
          setUserPosts(postsResult.posts || []);
        } catch (postsError) {
          console.error('Posts fetch error:', postsError);
          // Don't fail the whole component if posts fail
          setUserPosts([]);
        }
        
        setHasFetched(true);
      } catch (err) {
        console.error('General fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [authUser?._id, hasFetched]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle follow/unfollow
  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await callAPI(`users/unfollow/${user._id}`, 'POST');
        setIsFollowing(false);
      } else {
        await callAPI(`users/follow/${user._id}`, 'POST');
        setIsFollowing(true);
      }
    } catch (err) {
      console.error('Error toggling follow:', err);
    }
  };

  // Handle opening followers/following modal
  const openModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  // Handle edit profile modal
  const openEditProfile = () => {
    setEditProfileOpen(true);
  };

  const closeEditProfile = () => {
    setEditProfileOpen(false);
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  // Local handlers for post interactions (optimistic UI)
  const handleLike = (postId, isLiked) => {
    setUserPosts(prev => prev.map(p => {
      if (p._id === postId) {
        const likes = p.likes || [];
        const updated = isLiked ? likes.filter(id => id !== authUser?._id) : [...likes, authUser?._id];
        return { ...p, likes: updated };
      }
      return p;
    }));
    // TODO: integrate real API call if desired
  };

  const handleBookmark = (postId, isBookmarked) => {
    setUserPosts(prev => prev.map(p => {
      if (p._id === postId) {
        const bms = p.bookmarks || [];
        const updated = isBookmarked ? bms.filter(id => id !== authUser?._id) : [...bms, authUser?._id];
        return { ...p, bookmarks: updated };
      }
      return p;
    }));
    // TODO: integrate real API call if desired
  };

  const toggleCommentInput = (postId) => {
    setShowCommentInput(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleCommentSubmit = (postId) => {
    const comment = commentInputs[postId];
    if (!comment?.trim()) return;

    const optimisticComment = {
      _id: `temp-${Date.now()}`,
      description: comment,
      postOwner: {
        _id: authUser?._id,
        username: authUser?.username,
        name: authUser?.name,
        profilePicture: authUser?.profilePicture || ""
      },
      createdAt: new Date().toISOString()
    };

    setUserPosts(prev => prev.map(p => {
      if (p._id === postId) {
        return { ...p, comments: [...(p.comments || []), optimisticComment] };
      }
      return p;
    }));
    setCommentInputs(prev => ({ ...prev, [postId]: "" }));
    // TODO: integrate real API call if desired
  };

  if (loading) {
    return (
      <div className="px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  return (
    <div className="px-4">
      <div>
        <div className="flex items-center py-2">
          <Link
            to="/"
            className="p-2 rounded-full hover:bg-gray-100 hover:cursor-pointer"
          >
            <IoMdArrowBack size="24px" />
          </Link>
          <div className="ml-2">
            <h1 className="font-bold text-lg">{user.fullName}</h1>
            <p className="text-gray-500 text-sm">{userPosts.length} posts</p>
          </div>
        </div>
        <img
          className="h-[33vh] w-full"
          src="https://imgs.search.brave.com/EZadOBu3F4kX3zsOvJP44m886qZS40_zCBoVXpx83Y0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAxNi8w/My8yNy8xOC81NC90/ZWNobm9sb2d5LTEy/ODM2MjRfNjQwLmpw/Zw"
          alt="Photo"
        />
        <div className="absolute top-52 ml-2 border-4 border-white rounded-full">
          <Avatar
            src={
              user.profilePicture ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.fullName || user.name || user.username || "User"
              )}&background=random`
            }
            size="120"
            round={true}
          />
        </div>
        <div className="text-right m-4">
          {isOwnProfile ? (
            <button 
              onClick={openEditProfile}
              className="px-4 py-1 hover:bg-gray-200 rounded-full text-right border border-gray-400"
            >
              Edit Profile
            </button>
          ) : (
            <button 
              onClick={handleFollowToggle}
              className={`px-4 py-1 rounded-full text-right border transition-colors ${
                isFollowing 
                  ? 'bg-gray-200 text-black border-gray-400 hover:bg-gray-300' 
                  : 'bg-black text-white border-black hover:bg-gray-800'
              }`}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
        <div className="m-4">
          <h1 className="font-bold text-xl">{user.fullName}</h1>
          <p className="text-gray-500">@{user.username}</p>
        </div>
        <div className="m-4 text-sm">
          <p>{user.bio || 'No bio available'}</p>
        </div>
        <div className="m-4 flex space-x-4 text-sm">
          <div 
            className="cursor-pointer hover:underline"
            onClick={() => openModal('following')}
          >
            <span className="font-bold">{user.following?.length || 0}</span>
            <span className="text-gray-500 ml-1">Following</span>
          </div>
          <div 
            className="cursor-pointer hover:underline"
            onClick={() => openModal('followers')}
          >
            <span className="font-bold">{user.followers?.length || 0}</span>
            <span className="text-gray-500 ml-1">Followers</span>
          </div>
        </div>
        {/* User's Posts */}
        <div className="m-4">
          <h2 className="font-bold text-lg mb-2">Posts</h2>
          {userPosts.length > 0 ? (
            <div className="w-full">
              {userPosts.map((post) => (
                <Tweet
                  key={post._id}
                  post={{
                    ...post,
                    postOwner: {
                      _id: user._id,
                      username: user.username,
                      name: user.fullName || user.name || user.username,
                      profilePicture: user.profilePicture,
                    },
                  }}
                  authUserId={authUser?._id}
                  onToggleLike={handleLike}
                  onToggleBookmark={handleBookmark}
                  showComment={!!showCommentInput[post._id]}
                  onToggleComment={() => toggleCommentInput(post._id)}
                  commentInput={commentInputs[post._id] || ""}
                  onChangeComment={(val) => setCommentInputs(prev => ({ ...prev, [post._id]: val }))}
                  onSubmitComment={() => handleCommentSubmit(post._id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No posts yet</p>
              {isOwnProfile && (
                <p className="text-gray-400 text-sm mt-1">Share your first post!</p>
              )}
            </div>
          )}
        </div>
        {/* Followers/Following Modal */}
        <FollowersModal
          isOpen={modalOpen}
          onClose={closeModal}
          userId={user?._id}
          type={modalType}
          username={user?.username}
        />
        
        {/* Edit Profile Modal */}
        <EditProfileModal
          isOpen={editProfileOpen}
          onClose={closeEditProfile}
          user={user}
          onUserUpdate={handleUserUpdate}
        />
      </div>
    </div>
  );
};

export default Profile;
