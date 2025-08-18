import useAPICall from "../api/useAPICall";

const useSearchUsers = () => {
  const callAPI = useAPICall();
  const getUsers = async (query) => {
    try {
      const response = await callAPI(`/user/search?.q=${query}`, "GET");
      return { success: true, data: response };
    } catch (error) {
      console.log(error);
      return { success: false, error: error.message };
    }
  };
  return { getUsers };
};

export default useSearchUsers;
