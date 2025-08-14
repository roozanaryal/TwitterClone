import useAPICall from "../api/useAPICall";
// import { useAuthContext } from "../context/AuthContext";

const useAddToBookmark = () => {
  const callAPI = useAPICall();
  // const { user } = useAuthContext();

  const addToBookmark = async (postId) => {
    try {
      const response = await callAPI(`/api/bookmarks/${postId}`, "POST");
      return { success: true, data: response };
    } catch (error) {
      console.log("Error adding bookmark:", error);
      return { success: false, error: error.message };
    }
  };

  const removeFromBookmark = async (postId) => {
    try {
      const response = await callAPI(`/api/bookmarks/${postId}`, "DELETE");
      return { success: true, data: response };
    } catch (error) {
      console.log("Error removing bookmark:", error);
      return { success: false, error: error.message };
    }
  };

  return {
    addToBookmark,
    removeFromBookmark,
  };
};

export default useAddToBookmark;
