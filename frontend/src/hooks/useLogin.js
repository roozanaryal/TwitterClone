import useAPICall from "../api/useAPICall";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
  const { setAuthUser } = useAuthContext();
  const callAPI = useAPICall();
  const navigate = useNavigate();

  const login = async (username, password) => {
    try {
      // Input validation
      if (!username?.trim() || !password) {
        throw new Error("Please enter both username and password");
      }

      console.log('Sending login request for username:', username);
      
      const data = await callAPI("/auth/login", "POST", {
        username: username.trim().toLowerCase(),
        password,
      }, { 
        skipAuth: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Login response:', data);
      
      if (!data || !data._id) {
        console.error('Invalid response data:', data);
        throw new Error("Invalid response from server. Please try again.");
      }
      
      // Store user data in localStorage and context
      localStorage.setItem("xCloneUser", JSON.stringify(data));
      setAuthUser(data);
      console.log('User authenticated successfully:', { id: data._id, username: data.username });

      // Add a small delay before redirecting to ensure state is updated
      setTimeout(() => {
        if (data.isAdmin) {
          console.log('Redirecting to admin dashboard');
          navigate("/admin");
        } else {
          console.log('Redirecting to home');
          navigate("/");
        }
      }, 100);

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
