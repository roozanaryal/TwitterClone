import { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import useAPICall from '../api/useAPICall';

const useGetPost = (type = 'all') => {
  const { authUser } = useAuthContext();
  const callAPI = useAPICall();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    if (!authUser) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      let endpoint = 'tweets/';
      switch (type) {
        case 'following':
          endpoint += 'followingfeed';
          break;
        case 'user':
          endpoint += 'getmyposts';
          break;
        default:
          endpoint += 'getposts';
      }

      const data = await callAPI(endpoint, 'GET');
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError(error.message || 'Failed to fetch posts');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch posts when component mounts or type changes
  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, authUser]);

  // Refresh posts function
  const refreshPosts = () => {
    fetchPosts();
  };

  return {
    posts,
    isLoading,
    error,
    refreshPosts,
  };
};

export default useGetPost;