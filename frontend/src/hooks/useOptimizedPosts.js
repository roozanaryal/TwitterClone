import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAPICall from '../api/useAPICall';

export const useOptimizedPosts = (type = 'all') => {
  const callAPI = useAPICall();
  const queryClient = useQueryClient();

  // Fetch posts with React Query
  const {
    data: posts = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['posts', type],
    queryFn: async () => {
      const endpoint = type === 'following' ? 'tweets/following' : 'tweets/all';
      return await callAPI(endpoint, 'GET');
    },
    staleTime: 2 * 60 * 1000, // 2 minutes for posts
    cacheTime: 5 * 60 * 1000, // 5 minutes cache
  });

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: async ({ postId, isLiked }) => {
      const endpoint = isLiked ? `tweets/unlike/${postId}` : `tweets/like/${postId}`;
      return await callAPI(endpoint, 'POST');
    },
    onMutate: async ({ postId, isLiked, userId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['posts', type] });
      
      // Snapshot previous value
      const previousPosts = queryClient.getQueryData(['posts', type]);
      
      // Optimistically update
      queryClient.setQueryData(['posts', type], (old = []) =>
        old.map(post => {
          if (post._id === postId) {
            return {
              ...post,
              likes: isLiked 
                ? post.likes.filter(id => id !== userId)
                : [...(post.likes || []), userId]
            };
          }
          return post;
        })
      );
      
      return { previousPosts };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts', type], context.previousPosts);
      }
    },
  });

  // Bookmark mutation
  const bookmarkMutation = useMutation({
    mutationFn: async ({ postId, isBookmarked }) => {
      const endpoint = `bookmarks/${postId}`;
      const method = isBookmarked ? 'DELETE' : 'POST';
      return await callAPI(endpoint, method);
    },
    onMutate: async ({ postId, isBookmarked, userId }) => {
      await queryClient.cancelQueries({ queryKey: ['posts', type] });
      const previousPosts = queryClient.getQueryData(['posts', type]);
      
      queryClient.setQueryData(['posts', type], (old = []) =>
        old.map(post => {
          if (post._id === postId) {
            return {
              ...post,
              bookmarks: isBookmarked 
                ? (post.bookmarks || []).filter(id => id !== userId)
                : [...(post.bookmarks || []), userId]
            };
          }
          return post;
        })
      );
      
      return { previousPosts };
    },
    onError: (err, variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts', type], context.previousPosts);
      }
    },
  });

  return {
    posts,
    isLoading,
    error,
    refetch,
    likeMutation,
    bookmarkMutation,
  };
};
