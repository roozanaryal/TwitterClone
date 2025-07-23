import { baseUrl } from "./useSignup";
import { useAuthContext } from "../context/AuthContext";

const useCreatePost = () => {
  const { authUser } = useAuthContext();
  const createPost = async (description) => {
    try {
      if (!authUser || !description) {
        throw new Error("User not found and description is required");
      }
      const res = await fetch(`${baseUrl}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create post");
      }
      console.log(data);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };
  return { createPost };
};

export default useCreatePost;
