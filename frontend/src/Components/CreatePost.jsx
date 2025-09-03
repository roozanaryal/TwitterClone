import Avatar from "react-avatar";
import { CiImageOn } from "react-icons/ci";
import { useRef, useState } from "react";
import PropTypes from "prop-types";
// import { usePostFocus } from "../context/PostFocusContext";
import useCreatePost from "../hooks/useCreatePost";
import { useAuthContext } from "../hooks/useAuthContext";

const CreatePost = ({ onPostCreated }) => {
  const inputRef = useRef(null);
  const { authUser } = useAuthContext();
  const [description, setDescription] = useState("");
  const { createPost } = useCreatePost();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPost(description, description); // Send both fields to pass backend validation
      setDescription(""); // clear input on success
      if (onPostCreated) {
        onPostCreated(); // Refresh posts after creation
      }
    } catch (error) {
      // Optionally show error to user
      alert(error.message || "Failed to create post");
    }
  };
  return (
    <div className="w-[100%]">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center p-4 bg-white">
          <div>
            <Avatar
              src={authUser?.profilePicture || ""}
              name={authUser?.name || authUser?.username}
              size="40"
              round={true}
            />
          </div>
          <input
            ref={inputRef}
            autoFocus
            type="text"
            className="w-full outline-none border-none text-xl ml-2 bg-transparent"
            placeholder="What is happening?!"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <div>
            <CiImageOn size="24px" />
          </div>
          <button
            type="submit"
            className="bg-[#1D9BF0] px-4 py-1 text-lg text-white text-right border-none rounded-full"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

CreatePost.propTypes = {
  onPostCreated: PropTypes.func,
};

export default CreatePost;
