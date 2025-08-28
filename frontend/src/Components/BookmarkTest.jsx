import { useState } from 'react';
import useAddToBookmark from '../hooks/useAddToBookmark';
import useGetBookmarks from '../hooks/useGetBookmarks';

const BookmarkTest = () => {
  const [postId, setPostId] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  const [message, setMessage] = useState('');
  
  const { addToBookmark, removeFromBookmark } = useAddToBookmark();
  const { getBookmarks } = useGetBookmarks();
  
  const handleAddBookmark = async () => {
    if (!postId) {
      setMessage('Please enter a post ID');
      return;
    }
    
    const result = await addToBookmark(postId);
    if (result.success) {
      setMessage(`Successfully bookmarked post ${postId}`);
    } else {
      setMessage(`Error: ${result.error}`);
    }
  };
  
  const handleRemoveBookmark = async () => {
    if (!postId) {
      setMessage('Please enter a post ID');
      return;
    }
    
    const result = await removeFromBookmark(postId);
    if (result.success) {
      setMessage(`Successfully removed bookmark for post ${postId}`);
    } else {
      setMessage(`Error: ${result.error}`);
    }
  };
  
  const handleGetBookmarks = async () => {
    const result = await getBookmarks();
    if (result.success) {
      setBookmarks(result.data.bookmarks);
      setMessage(`Retrieved ${result.data.bookmarks.length} bookmarks`);
    } else {
      setMessage(`Error: ${result.error}`);
    }
  };
  
  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Bookmark Test</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Post ID:
        </label>
        <input
          type="text"
          value={postId}
          onChange={(e) => setPostId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter post ID"
        />
      </div>
      
      <div className="flex space-x-2 mb-4">
        <button
          onClick={handleAddBookmark}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition"
        >
          Add Bookmark
        </button>
        <button
          onClick={handleRemoveBookmark}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition"
        >
          Remove Bookmark
        </button>
      </div>
      
      <button
        onClick={handleGetBookmarks}
        className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md mb-4 transition"
      >
        Get All Bookmarks
      </button>
      
      {message && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-md">
          {message}
        </div>
      )}
      
      {bookmarks.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Your Bookmarks:</h3>
          <ul className="space-y-2">
            {bookmarks.map((bookmark) => (
              <li key={bookmark._id} className="p-2 border border-gray-200 rounded-md">
                <p className="font-medium">{bookmark.description || 'No description'}</p>
                <p className="text-sm text-gray-500">ID: {bookmark._id}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BookmarkTest;
