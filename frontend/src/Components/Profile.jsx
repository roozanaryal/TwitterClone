import { IoMdArrowBack } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import Avatar from "react-avatar";
import { useState, useEffect } from "react";
import { FaRegComment, FaHeart } from "react-icons/fa";
import { CiHeart, CiBookmark } from "react-icons/ci";
import { useAuthContext } from "../context/AuthContext";
import useGetOtherUserProfile from "../hooks/useGetOtherUserProfile";
import useAPICall from "../api/useAPICall";

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
            src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.fullName}&background=random`}
            size="120"
            round={true}
          />
        </div>
        <div className="text-right m-4">
          {isOwnProfile ? (
            <button className="px-4 py-1 hover:bg-gray-200 rounded-full text-right border border-gray-400">
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
          <div>
            <span className="font-bold">{user.following?.length || 0}</span>
            <span className="text-gray-500 ml-1">Following</span>
          </div>
          <div>
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
                <div className="border-b border-gray-200 w-full" key={post._id}>
                  <div className="flex p-4">
                    <Avatar 
                      src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.fullName}&background=random`}
                      size="40" 
                      round={true} 
                    />
                    <div className="ml-2 flex-1">
                      <div className="flex items-center ml-2">
                        <h1 className="font-bold">{user.fullName}</h1>
                        <p className="text-gray-500 text-sm ml-1">
                          @{user.username} · {formatTimeAgo(post.createdAt)}
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
                          <div className="p-2 hover:bg-blue-200 rounded-full cursor-pointer">
                            <FaRegComment size="20px" />
                          </div>
                          <p className="text-sm text-gray-500">{post.comments?.length || 0}</p>
                        </div>
                        <div className="flex items-center">
                          <div className="p-2 hover:bg-red-200 rounded-full cursor-pointer">
                            {post.likes?.includes(authUser?._id) ? (
                              <FaHeart size="20px" className="text-red-500" />
                            ) : (
                              <CiHeart size="20px" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{post.likes?.length || 0}</p>
                        </div>
                        <div className="flex items-center">
                          <div className="p-2 hover:bg-blue-200 rounded-full cursor-pointer">
                            {post.bookmarks?.includes(authUser?._id) ? (
                              <CiBookmark size="20px" className="text-blue-500 fill-current" />
                            ) : (
                              <CiBookmark size="20px" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{post.bookmarks?.length || 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
      </div>
    </div>
  );
};

export default Profile;
