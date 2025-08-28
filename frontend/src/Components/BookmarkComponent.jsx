import Avatar from "react-avatar";
import { FaRegComment } from "react-icons/fa";
import { CiHeart, CiBookmark } from "react-icons/ci";
import { useEffect, useState } from "react";

const baseUrl = "http://localhost:5000";
const BookmarkComponent = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookmarks = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${baseUrl}/api/bookmarks/`, {
          credentials: "include",
        });
        const data = await res.json();
        console.log(data);
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch bookmarks");
        }
        setBookmarks(data.posts || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  if (loading)
    return <div className="p-6 text-center">Loading bookmarks...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="w-full">
      {bookmarks.length === 0 ? (
        <div className="p-6 text-center text-gray-500">No bookmarks found.</div>
      ) : (
        bookmarks.map((tweet) => (
          <div className="border-b border-gray-200 w-full" key={tweet._id}>
            <div className="flex p-4">
              <Avatar
                src={
                  tweet.postOwner?.profilePicture ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    tweet.postOwner?.name || "User"
                  )}`
                }
                size="40"
                round={true}
              />
              <div className="ml-2">
                <div className="flex items-center ml-2">
                  <h1 className="font-bold">
                    {tweet.postOwner?.name || "Unknown"}
                  </h1>
                  <p className="text-gray-500 text-sm ml-1">
                    {tweet.postOwner?.username || "unknown"} ·{" "}
                    {new Date(tweet.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <p>{tweet?.description || tweet?.content || ""}</p>
                </div>
                <div className="flex justify-between my-3">
                  <div className="flex items-center">
                    <div className="p-2 hover:bg-blue-200 rounded-full cursor-pointer">
                      <FaRegComment size="20px" />
                    </div>
                    <p>{tweet?.comments?.length || 0}</p>
                  </div>
                  <div className="flex items-center">
                    <div className="p-2 hover:bg-red-200 rounded-full cursor-pointer">
                      <CiHeart size="20px" />
                    </div>
                    <p>{tweet.likes?.length || 0}</p>
                  </div>
                  <div className="flex items-center">
                    <div className="p-2 hover:bg-blue-200 rounded-full cursor-pointer">
                      <CiBookmark size="20px" />
                    </div>
                    <p>{tweet.bookmarks?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default BookmarkComponent;
