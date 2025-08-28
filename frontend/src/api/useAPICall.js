import { useAuthContext } from "../context/AuthContext";
import { useCallback } from "react";

const baseUrl = "http://localhost:5000/api";

export function useAPICall() {
  const { authUser } = useAuthContext();

  const callAPI = useCallback(async (urlPath, methodType, body, options = {}) => {
    const { skipAuth = false } = options;
    
    // For non-auth routes, we still check if user is logged in (except for login/signup)
    if (!skipAuth && !authUser) {
      throw new Error("User not authenticated");
    }
    
    if (!methodType) {
      throw new Error("Method type not found");
    }
    if (!urlPath) {
      throw new Error("URL path not found");
    }
    try {
      const response = await fetch(`${baseUrl}/${urlPath.replace(/^\//, "")}`, {
        method: methodType,
        headers: {
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
        credentials: "include", // This sends the httpOnly cookie
      });
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(
          `Server returned non-JSON response: ${text.slice(0, 100)}`
        );
      }
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.message || "API call failed");
      }
      return data;
    } catch (error) {
      console.error("API call error:", error);
      throw error;
    }
  }, [authUser]);

  return callAPI;
}

export default useAPICall;
