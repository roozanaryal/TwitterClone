import useAPICall from "../api/useAPICall";

const useAddBio = () => {
  const callAPI = useAPICall();
  
  const updateBio = async (bio) => {
    try {
      const response = await callAPI('users/bio', 'PUT', { bio });
      return { success: true, data: response };
    } catch (error) {
      console.log(error);
      return { success: false, error: error.message };
    }
  };
  
  const getBio = async () => {
    try {
      const response = await callAPI('users/bio', 'GET', null);
      return { success: true, data: response };
    } catch (error) {
      console.log(error);
      return { success: false, error: error.message };
    }
  };
  
  return { updateBio, getBio };
};

export default useAddBio;
