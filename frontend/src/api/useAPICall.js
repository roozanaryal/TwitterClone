import { useAuthContext } from "../context/AuthContext";

const baseUrl = "http://localhost:5000/api";

export function useAPICall() {
  const { authUser } = useAuthContext();
  console.log(authUser);


  const callAPI = async (urlPath, methodType, body, options = {}) => {
    const { skipAuth = false } = options;
    if (!skipAuth && !authUser?.token) {
      throw new Error("Auth token not found");
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
          ...(!skipAuth && authUser && authUser.token
            ? { Authorization: `Bearer ${authUser.token}` }
            : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
        credentials: "include",
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
  };

  return callAPI;
}

export default useAPICall;
