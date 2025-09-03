import useAPICall from "../api/useAPICall";
import { useAuthContext } from "./useAuthContext";
const useSignup = () => {
  const { setAuthUser } = useAuthContext();
  const callAPI = useAPICall();
  
  const signup = async ({ name, username, password, email }) => {
    try {
      // All validation is now handled by handleInputErrors, which throws on failure
      handleInputErrors({
        name,
        username,
        password,
        email,
      });

      // Make the API request using the useAPICall hook
      const data = await callAPI("/auth/signup", "POST", {
        name: name.trim(),
        username: username.trim().toLowerCase(),
        password,
        email,
      }, { skipAuth: true });

      if (!data || !data._id) {
        throw new Error("Invalid response from server");
      }

      // Store user data in localStorage
      localStorage.setItem("xCloneUser", JSON.stringify(data));
      setAuthUser(data);

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  return { signup };
};

export default useSignup;

function handleInputErrors({ name, username, password, email }) {
  if (!name?.trim() || !username?.trim() || !password || !email) {
    throw new Error("All fields are required");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  if (username.length < 3) {
    throw new Error("Username must be at least 3 characters long");
  }

  if (name.trim().length < 2) {
    throw new Error("Please enter a valid full name");
  }
}
