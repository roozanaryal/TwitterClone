import useAPICall from "../api/useAPICall";

const useDeletePost = () => {
  const callAPI = useAPICall();
  
  const deletePost = async (postId) => {
    try {
      const response = await callAPI(`tweets/delete/${postId}`, 'POST');
      return { success: true, data: response };
    } catch (error) {
      console.log(error);
      return { success: false, error: error.message };
    }
  };
  
  return { deletePost };
};

export default useDeletePost;
