import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import Avatar from "react-avatar";
import useAPICall from "../api/useAPICall";
import { useAuthContext } from "../context/AuthContext";
import PropTypes from "prop-types";

const FollowersModal = ({ isOpen, onClose, userId, type, username }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [followingStates, setFollowingStates] = useState({});
  const callAPI = useAPICall();
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (isOpen && userId) {
      fetchUsers();
    }
  }, [isOpen, userId, type]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const endpoint = type === 'followers' 
        ? `users/${userId}/followers` 
        : `users/${userId}/following`;
      
      const data = await callAPI(endpoint, 'GET');
      setUsers(data.users || []);
      
      // Initialize following states
      const states = {};
      data.users?.forEach(user => {
        states[user._id] = user.followers?.includes(authUser?._id);
      });
      setFollowingStates(states);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (targetUserId) => {
    try {
      const isCurrentlyFollowing = followingStates[targetUserId];
      
      if (isCurrentlyFollowing) {
        await callAPI(`users/unfollow/${targetUserId}`, 'POST');
        setFollowingStates(prev => ({ ...prev, [targetUserId]: false }));
      } else {
        await callAPI(`users/follow/${targetUserId}`, 'POST');
        setFollowingStates(prev => ({ ...prev, [targetUserId]: true }));
      }
    } catch (err) {
      console.error('Error following/unfollowing user:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">
            {type === 'followers' ? 'Followers' : 'Following'}
            {username && ` - @${username}`}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <IoMdClose size="24px" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">
              <p>Error: {error}</p>
              <button 
                onClick={fetchUsers}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>
                {type === 'followers' 
                  ? 'No followers yet' 
                  : 'Not following anyone yet'
                }
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {users.map((user) => (
                <div key={user._id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar
                      src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.username}&background=random`}
                      size="48"
                      round={true}
                    />
                    <div className="ml-3">
                      <h3 className="font-bold text-sm">{user.fullName}</h3>
                      <p className="text-gray-500 text-sm">@{user.username}</p>
                      {user.bio && (
                        <p className="text-gray-600 text-xs mt-1 max-w-48 truncate">
                          {user.bio}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Only show follow button if it's not the current user */}
                  {user._id !== authUser?._id && (
                    <button 
                      className={`px-4 py-1 rounded-full text-sm font-bold transition-colors ${
                        followingStates[user._id]
                          ? 'bg-gray-200 text-black hover:bg-gray-300' 
                          : 'bg-black text-white hover:bg-gray-800'
                      }`}
                      onClick={() => handleFollow(user._id)}
                    >
                      {followingStates[user._id] ? 'Unfollow' : 'Follow'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

FollowersModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userId: PropTypes.string,
  type: PropTypes.oneOf(['followers', 'following']).isRequired,
  username: PropTypes.string,
};

export default FollowersModal;
