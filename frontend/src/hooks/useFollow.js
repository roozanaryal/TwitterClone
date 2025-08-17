import { useState } from "react";
import useAPICall from "../api/useAPICall";
import { FOLLOW_ENDPOINTS } from "../api/follow.api";

const useFollow = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const callAPI = useAPICall();
  const followUser = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await callAPI(FOLLOW_ENDPOINTS.FOLLOW(userId), "POST", {});
      setLoading(false);
      return response;
    } catch (err) {
      setError(err.message || "Failed to follow user");
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const unfollowUser = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await callAPI(FOLLOW_ENDPOINTS.UNFOLLOW(userId), "POST", {});
      setLoading(false);
      return response;
    } catch (err) {
      setError(err.message || "Failed to unfollow user");
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  return {
    followUser,
    unfollowUser,
    loading,
    error,
  };
};

export default useFollow;
