import { IoMdArrowBack } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import Avatar from "react-avatar";
import { useEffect, useState, useCallback } from "react";
import useAPICall from "../api/useAPICall";

const Profile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const callAPI = useAPICall();

  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      const userData = await callAPI(`users/profile/${username}`, "GET");
      setUser(userData.user);
      
      // Fetch user's posts
      const postsData = await callAPI(`tweets/user/${userData.user._id}`, "GET");
      setPosts(postsData.posts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [username, callAPI]);

  useEffect(() => {
    if (username) {
      fetchUserProfile();
    }
  }, [username, fetchUserProfile]);

  if (loading) {
    return <div className="px-4 py-4">Loading...</div>;
  }

  if (error) {
    return <div className="px-4 py-4 text-red-500">Error: {error}</div>;
  }

  if (!user) {
    return <div className="px-4 py-4">User not found</div>;
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
            <h1 className="font-bold text-lg">{user.name}</h1>
            <p className="text-gray-500 text-sm">{user.postsCount} posts</p>
          </div>
        </div>
        <img
          className="h-[33vh] w-full object-cover"
          src={user.coverPicture || "https://imgs.search.brave.com/EZadOBu3F4kX3zsOvJP44m886qZS40_zCBoVXpx83Y0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAxNi8w/My8yNy8xOC81NC90/ZWNobm9sb2d5LTEy/ODM2MjRfNjQwLmpw/Zw"}
          alt="Cover"
        />
        <div className="absolute top-52 ml-2 border-4 border-white rounded-full">
          <Avatar
            src={user.profilePicture || "https://imgs.search.brave.com/JGCZZygUlFTk8RW8L5uyeuIACCp0BsQI8IhaYyZmS4k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9yZXMu/Y2xvdWRpbmFyeS5j/b20vZGVtby9pbWFn/ZS91cGxvYWQvd18x/NTAsaF8xNTAsY19m/aWxsLGdfZmFjZSxy/X21heC9mcm9udF9m/YWNlLnBuZw"}
            size="120"
            round={true}
          />
        </div>
        <div className="text-right m-4">
          <button className="px-4 py-1 hover:bg-gray-200 rounded-full text-right border border-gray-400">
            Edit Profile
          </button>
        </div>
        <div className="m-4">
          <h1 className="font-bold text-xl">{user.name}</h1>
          <p>@{user.username}</p>
        </div>
        <div className="m-4 text-sm">
          <p>{user.bio || "No bio available"}</p>
        </div>
        {/* User's Posts */}
        <div className="m-4">
          <h2 className="font-bold text-lg mb-2">Posts</h2>
          {posts.length === 0 ? (
            <p className="text-gray-500 py-3">No posts yet</p>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="border-b border-gray-200 py-3">
                <h3 className="font-semibold">{post.description}</h3>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
