import useAPICall from "../api/useAPICall";

const useGetOtherUserProfile = () => {
  const callAPI = useAPICall();

  const getUserProfile = async (username) => {
    try {
      const response = await callAPI(`users/otherprofile/${username}`, "GET");
      return { success: true, data: response };
    } catch (error) {
      console.log(error);
      return { success: false, error: error.message };
    }
  };

  return { getUserProfile };
};

export default useGetOtherUserProfile;
