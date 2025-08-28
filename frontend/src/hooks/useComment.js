import useAPICall from "../api/useAPICall";

const useComment = () => {
  const callAPI = useAPICall();

  const addComment = async (postId, comment) => {
    try {
      const response = await callAPI(`tweets/comment/${postId}`, "POST", {
        comment
      });
      return { success: true, data: response };
    } catch (error) {
      console.log("Error adding comment:", error);
      return { success: false, error: error.message };
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const response = await callAPI(`tweets/deletecomment/${commentId}`, "DELETE");
      return { success: true, data: response };
    } catch (error) {
      console.log("Error deleting comment:", error);
      return { success: false, error: error.message };
    }
  };

  return {
    addComment,
    deleteComment,
  };
};

export default useComment;
