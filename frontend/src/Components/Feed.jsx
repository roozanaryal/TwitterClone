import CreatePost from "./CreatePost";
import Tweet from "./Tweet";

const Feed = () => {
   return (
      <div className="w-[60%]">
         <div>
         <CreatePost />
         <Tweet/>
         </div>
      </div>
   );
};

export default Feed;
