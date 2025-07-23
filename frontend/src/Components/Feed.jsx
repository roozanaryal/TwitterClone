import CreatePost from "./CreatePost";
import Tweet from "./Tweet";
import { PostFocusProvider } from "../context/PostFocusContext";

const Feed = () => {
   return (
      <div className="px-4">
        <div>
          <CreatePost />
          <Tweet/>
        </div>
      </div>
   );
};

export default Feed;
