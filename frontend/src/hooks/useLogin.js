import { useAuthContext } from "../context/AuthContext";
import { baseUrl } from "./useSignup";
const useLogin = () => {
  const { setAuthUser } = useAuthContext();

  const login = async (username, password) => {
    try {
      // Input validation
      if (!username.trim() || !password) {
        throw new Error("Please fill in all fields");
      }

      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Login failed. Please check your credentials."
        );
      }

      // Verify that we received the expected user data
      if (!data || !data._id) {
        throw new Error("Invalid response from server");
      }
      console.log(data);
      // Store token separately if present
      const { token, ...userData } = data;

      // Store token separately if present
      if (token) {
        localStorage.setItem("xClone", token);
      }

      // Store user data in localStorage and context
      localStorage.setItem("xCloneUser", JSON.stringify(userData));
      setAuthUser(userData);

      // Return the user data in case it's needed
      return userData;
    } catch (error) {
      // Log the error for debugging
      console.error("Login error:", error);
      // Show user-friendly error message
      // Re-throw the error so the component can handle it if needed
      throw error;
    }
  };
  return { login };
};

export default useLogin;
