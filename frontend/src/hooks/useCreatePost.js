import useAPICall from "../api/useAPICall";

const useCreatePost = () => {
  const callAPI = useAPICall();

  const createPost = async (description, content = "") => {
    try {
      if (!description) {
        throw new Error("Description is required");
      }

      const data = await callAPI("/tweets/createpost", "POST", {
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
