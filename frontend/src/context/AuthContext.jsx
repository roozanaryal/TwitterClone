import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const getInitialUser = () => {
    try {
      return JSON.parse(localStorage.getItem("xCloneUser")) || null;
    } catch {
      return null;
    }
  };

  const [authUser, setAuthUserState] = useState(getInitialUser());
  const [authLoading, setAuthLoading] = useState(true);

  const setAuthUser = (user) => {
    setAuthUserState(user);
    if (user) {
      localStorage.setItem("xCloneUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("xCloneUser");
      localStorage.removeItem("xClone"); // Remove old token if exists
    }
  };

  // Optional: Listen for localStorage changes from other tabs
  useEffect(() => {
    const onStorage = () => {
      setAuthUserState(getInitialUser());
    };
    window.addEventListener("storage", onStorage);
    
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // On mount, check if user is authenticated via cookie
  useEffect(() => {
    const checkAuth = async () => {
      setAuthLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          credentials: "include",
        });
        if (res.ok) {
          const user = await res.json();
          // Ensure token is included in the user object
          if (user && !user.token) {
            // If no token in response, try to get from localStorage
            const storedUser = JSON.parse(localStorage.getItem("xCloneUser"));
            if (storedUser && storedUser.token) {
              user.token = storedUser.token;
            }
          }
          setAuthUser(user);
        } else {
          setAuthUser(null);
        }
      } catch {
        setAuthUser(null);
      }
      setAuthLoading(false);
    };
    checkAuth();
    // Only run on mount
    // eslint-disable-next-line
  }, []);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
