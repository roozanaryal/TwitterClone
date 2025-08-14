import useAPICall from "../api/useAPICall";

const useLikePost = () => {
  const callAPI = useAPICall();
  
  const likePost = async (postId) => {
    try {
      const response = await callAPI(`tweets/like/${postId}`, 'POST');
      return { success: true, data: response };
    } catch (error) {
      console.log(error);
      return { success: false, error: error.message };
    }
  };
  
  const unlikePost = async (postId) => {
    try {
      const response = await callAPI(`tweets/unlike/${postId}`, 'POST');
      return { success: true, data: response };
    } catch (error) {
      console.log(error);
      return { success: false, error: error.message };
    }
  };
  
  return { likePost, unlikePost };
};

export default useLikePost;
