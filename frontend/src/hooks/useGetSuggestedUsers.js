import useAPICall from "../api/useAPICall";

const useGetSuggestedUsers = () => {
  const callAPI = useAPICall();
  
  const getSuggestedUsers = async () => {
    try {
      const response = await callAPI('users/suggested', 'GET');
      return { success: true, data: response };
    } catch (error) {
      console.log(error);
      return { success: false, error: error.message };
    }
  };
  
  return { getSuggestedUsers };
};

export default useGetSuggestedUsers;
