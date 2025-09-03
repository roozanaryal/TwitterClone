import { useAuthContext } from "./useAuthContext";
import useAPICall from "../api/useAPICall";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
   const { setAuthUser } = useAuthContext();
   const callAPI = useAPICall();
   const navigate = useNavigate();

   const logout = async () => {
      try {
         const data = await callAPI("/auth/logout", "POST", null, { skipAuth: true });
         if (data.success) {
            localStorage.removeItem("xCloneUser");
            localStorage.removeItem("xClone"); // Remove old token if exists
            setAuthUser(null);
            // Redirect to login page
            navigate("/login");
         }
      } catch (error) {
         console.log(error);
         // Even if logout fails, clear local data and redirect
         localStorage.removeItem("xCloneUser");
         localStorage.removeItem("xClone");
         setAuthUser(null);
         navigate("/login");
      }
   };

   return { logout };
};

export default useLogout;