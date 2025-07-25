import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const getInitialUser = () => {
    try {
      return JSON.parse(localStorage.getItem("xClone")) || null;
    } catch {
      return null;
    }
  };

  const [authUser, setAuthUserState] = useState(getInitialUser());
  const [authLoading, setAuthLoading] = useState(true);

  const setAuthUser = (user) => {
    setAuthUserState(user);
    if (user) {
      localStorage.setItem("xClone", JSON.stringify(user));
    } else {
      localStorage.removeItem("xClone");
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
