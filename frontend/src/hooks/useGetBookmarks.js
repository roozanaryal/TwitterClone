import useAPICall from "../api/useAPICall";

const useGetBookmarks = () => {
  const callAPI = useAPICall();

  const getBookmarks = async () => {
    try {
      const response = await callAPI(`/bookmarks`, "GET");
      return { success: true, data: response };
    } catch (error) {
      console.log("Error fetching bookmarks:", error);
      return { success: false, error: error.message };
    }
  };

  return {
    getBookmarks,
  };
};

export default useGetBookmarks;
