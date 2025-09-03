// Database query optimization utilities
export const optimizedQueries = {
  // Optimized posts query with proper indexing and population
  getPosts: (type = 'all', userId = null, limit = 20, skip = 0) => {
    const baseQuery = type === 'following' && userId 
      ? { postOwner: { $in: [] } } // Will be populated with following IDs
      : {};

    return {
      query: baseQuery,
      options: {
        sort: { createdAt: -1 },
        limit,
        skip,
        populate: [
          {
            path: 'postOwner',
            select: 'username name profilePicture',
          },
          {
            path: 'comments.postOwner',
            select: 'username name profilePicture',
          }
        ],
        lean: true, // Return plain JS objects for better performance
      }
    };
  },

  // Optimized user search with text indexing
  searchUsers: (query, limit = 10) => ({
    query: {
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } },
      ]
    },
    options: {
      select: 'username name profilePicture',
      limit,
      lean: true,
    }
  }),

  // Batch operations for likes/bookmarks
  batchUpdateLikes: (postIds, userId, action) => ({
    updateMany: {
      filter: { _id: { $in: postIds } },
      update: action === 'add' 
        ? { $addToSet: { likes: userId } }
        : { $pull: { likes: userId } }
    }
  }),
};

// Database indexes to create for optimal performance
export const recommendedIndexes = [
  // Posts collection
  { collection: 'posts', index: { createdAt: -1 } },
  { collection: 'posts', index: { postOwner: 1, createdAt: -1 } },
  { collection: 'posts', index: { likes: 1 } },
  { collection: 'posts', index: { bookmarks: 1 } },
  
  // Users collection
  { collection: 'users', index: { username: 1 } },
  { collection: 'users', index: { email: 1 } },
  { collection: 'users', index: { name: 'text', username: 'text' } }, // Text search
  
  // Comments
  { collection: 'posts', index: { 'comments.createdAt': -1 } },
];
