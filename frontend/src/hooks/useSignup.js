import { useAuthContext } from "../context/AuthContext";
export const baseUrl = "http://localhost:5000";
const useSignup = () => {
  const { setAuthUser } = useAuthContext();
  const signup = async ({ name, username, password, email }) => {
    try {
      // All validation is now handled by handleInputErrors, which throws on failure
      handleInputErrors({
        name,
        username,
        password,
        email,
      });

      // Make the API request
      const res = await fetch(`${baseUrl}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("xClone")
            ? { Authorization: `Bearer ${localStorage.getItem("xClone")}` }
            : {}),
        },
        body: JSON.stringify({
          name: name.trim(),
          username: username.trim().toLowerCase(),
          password,
          email,
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed. Please try again.");
      }

      if (!data || !data._id) {
        throw new Error("Invalid response from server");
      }

      // Store token separately if present
      if (data.token) {
        localStorage.setItem("xClone", data.token);
      }
      localStorage.setItem("xCloneUser", JSON.stringify(data));
      setAuthUser(data);

      return data;
    } catch (error) {
      console.log(error);
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
