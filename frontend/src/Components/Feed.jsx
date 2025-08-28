import { useState, useRef } from "react";
import CreatePost from "./CreatePost";
import PostList from "./PostList";
import ErrorBoundary from "./ErrorBoundary";

const Feed = () => {
  const [activeSection, setActiveSection] = useState("foryou");
  const postListRef = useRef();

  const handlePostCreated = () => {
    if (postListRef.current) {
      postListRef.current.refreshPosts();
    }
  };

  return (
    <div>
      {/* Section Tabs */}
      <div className="flex items-center justify-evenly border-b border-gray-200 sticky top-0 bg-white z-10">
        <div 
          className={`cursor-pointer hover:bg-gray-200 w-full text-center px-4 py-3 ${
            activeSection === "foryou" ? "border-b-2 border-blue-500" : ""
          }`}
          onClick={() => setActiveSection("foryou")}
        >
          <h1 className={`font-semibold text-lg ${
            activeSection === "foryou" ? "text-blue-600" : "text-gray-600"
          }`}>
            For You
          </h1>
        </div>
        <div 
          className={`cursor-pointer hover:bg-gray-200 w-full text-center px-4 py-3 ${
            activeSection === "following" ? "border-b-2 border-blue-500" : ""
          }`}
          onClick={() => setActiveSection("following")}
        >
          <h1 className={`font-semibold text-lg ${
            activeSection === "following" ? "text-blue-600" : "text-gray-600"
          }`}>
            Following
          </h1>
        </div>
      </div>

      {/* Create Post Section */}
      <div className="px-4">
        <CreatePost onPostCreated={handlePostCreated} />
      </div>

      {/* Posts Section */}
      <ErrorBoundary>
        <PostList ref={postListRef} type={activeSection === "foryou" ? "all" : "following"} />
      </ErrorBoundary>
    </div>
  );
};

export default Feed;
