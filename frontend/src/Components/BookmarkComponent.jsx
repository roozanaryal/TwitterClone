import { useEffect, useState, useCallback } from "react";
import useAPICall from "../api/useAPICall";
import Tweet from "./Tweet";

const BookmarkComponent = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const callAPI = useAPICall();

  const fetchBookmarks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await callAPI("bookmarks/", "GET");
      setBookmarks(data.posts || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [callAPI]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const handlePostUpdate = (postId, action, value) => {
    if (action === 'bookmark' && !value) {
      // Remove from bookmarks if unbookmarked
      setBookmarks(prev => prev.filter(post => post._id !== postId));
    }
  };

  if (loading)
    return <div className="p-6 text-center">Loading bookmarks...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="w-full">
      {bookmarks && bookmarks.length > 0 ? (
        bookmarks.map((tweet) => (
          <Tweet
            key={tweet._id}
            post={tweet}
            enableInteractions={true}
            onPostUpdate={handlePostUpdate}
          />
        ))
      ) : (
        <div className="p-6 text-center text-gray-500">No bookmarks found.</div>
      )}
    </div>
  );
};

export default BookmarkComponent;
