import { useAuthContext } from "../context/AuthContext";
import { baseUrl } from "./useSignup";
const useLogout = () => {
   
   const { setAuthUser } = useAuthContext();

   const logout = async () => {
      try {
         const res = await fetch(`${baseUrl}/api/auth/logout`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
         });
         const data = await res.json();
         if (data.success) {
            localStorage.removeItem("xClone");
            setAuthUser(null);
         }
      } catch (error) {
         console.log(error);
      }
   };

   return { logout };
};

export default useLogout;