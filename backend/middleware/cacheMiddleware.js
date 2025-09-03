import NodeCache from 'node-cache';

// Create cache instance with TTL (Time To Live)
const cache = new NodeCache({ 
  stdTTL: 300, // 5 minutes default
  checkperiod: 60, // Check for expired keys every 60 seconds
  useClones: false // Better performance
});

// Cache middleware factory
export const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    // Skip caching for authenticated requests that modify data
    if (req.method !== 'GET') {
      return next();
    }

    const key = `${req.originalUrl}_${req.user?._id || 'anonymous'}`;
    const cachedData = cache.get(key);

    if (cachedData) {
      return res.json(cachedData);
    }

    // Store original json method
    const originalJson = res.json;
    
    // Override json method to cache response
    res.json = function(data) {
      cache.set(key, data, duration);
      return originalJson.call(this, data);
    };

    next();
  };
};

// Cache invalidation utilities
export const invalidateCache = {
  posts: () => {
    const keys = cache.keys().filter(key => 
      key.includes('/tweets/') || key.includes('/posts/')
    );
    cache.del(keys);
  },
  
  user: (userId) => {
    const keys = cache.keys().filter(key => key.includes(userId));
    cache.del(keys);
  },
  
  all: () => {
    cache.flushAll();
  }
};

export default cache;
