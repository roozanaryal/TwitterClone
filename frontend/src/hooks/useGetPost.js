import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from '../context/AuthContext';
import axios from 'axios';

const useGetPost = (type = 'all', options = {}) => {
  const { authUser } = useAuthContext();
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const fetchPosts = async ({ pageParam = null }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authUser.token}`,
        },
        params: {
          limit: options.limit || 10,
          ...(pageParam && { cursor: pageParam }),
          ...(options.section && { section: options.section }),
          ...(options.userId && { userId: options.userId }),
        },
      };

      let endpoint = '/api/tweet/';
      switch (type) {
        case 'following':
          endpoint += 'followingfeed';
          break;
        case 'user':
          endpoint += 'myposts';
          break;
        default:
          endpoint += 'getposts';
      }

      const response = await axios.get(endpoint, config);
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch posts');
    }
  };

  const {
    data,
    isLoading,
    isError,
    error: queryError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['posts', type, cursor, options],
    queryFn: ({ pageParam }) => fetchPosts({ pageParam }),
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor || undefined;
    },
    enabled: !!authUser?.token,
    refetchOnWindowFocus: false,
    onError: (err) => {
      setError(err.message);
    },
  });

  // Handle infinite scroll pagination
  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    try {
      const newData = await fetchPosts({ pageParam: cursor });
      setPosts((prev) => [...prev, ...newData.posts]);
      setCursor(newData.nextCursor);
      setHasMore(!!newData.nextCursor);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Update posts when data changes
  useEffect(() => {
    if (data) {
      const allPosts = data.pages.flatMap((page) => page.posts);
      setPosts(allPosts);
      const lastPage = data.pages[data.pages.length - 1];
      setCursor(lastPage.nextCursor);
      setHasMore(!!lastPage.nextCursor);
    }
  }, [data]);

  // Refresh posts
  const refreshPosts = async () => {
    setCursor(null);
    await refetch();
  };

  return {
    posts,
    isLoading,
    isError,
    error: error || queryError?.message,
    hasMore,
    loadMore,
    isLoadingMore,
    refreshPosts,
    isRefreshing: isFetching && !isLoadingMore,
  };
};

export default useGetPost;