import useAPICall from "../api/useAPICall";

const useSearchUsers = () => {
  const callAPI = useAPICall();
  const getUsers = async () => {
    try {
      const response = await callAPI(`/user/search`, "GET");
      return { success: true, data: response };
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  };
  return { getUsers };
};

export default useSearchUsers;
