import useAPICall from "../api/useAPICall";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
  const { setAuthUser } = useAuthContext();
  const callAPI = useAPICall();
  const navigate = useNavigate();

  const login = async (username, password) => {
    try {
      // Input validation
      if (!username.trim() || !password) {
        throw new Error("Please fill in all fields");
      }

      const data = await callAPI("/auth/login", "POST", {
        username,
        password,
      }, { skipAuth: true });

      // Verify that we received the expected user data
      if (!data || !data._id) {
        throw new Error("Invalid response from server");
      }
      
      console.log("Login response:", data);
      console.log("User isAdmin:", data.isAdmin);
      
      // Store user data in localStorage and context
      localStorage.setItem("xCloneUser", JSON.stringify(data));
      setAuthUser(data);

      // Redirect based on user role
      if (data.isAdmin) {
        console.log("Redirecting admin user to /admin");
        navigate("/admin");
      } else {
        console.log("Redirecting regular user to /");
        navigate("/");
      }

      // Return the user data in case it's needed
      return data;
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
