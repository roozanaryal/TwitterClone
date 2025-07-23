// import { useAuthContext } from "../context/AuthContext";
import { apiCall } from "../api/apiCalls";

const useCreatePost = () => {
  // const { authUser } = useAuthContext();

  const createPost = async (description, content = "") => {
    try {
      if (!description) {
        throw new Error("User not found and description is required");
      }

      const data = await apiCall("/tweets/createpost", "POST", {
        description,
        content,
      });

      return data;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  };

  return { createPost };
};

export default useCreatePost;
