import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import Spinner from "./Spinner";

const AdminRoute = ({ children }) => {
  const { authUser, authLoading } = useAuthContext();
  
  console.log("AdminRoute - authUser:", authUser);
  console.log("AdminRoute - authLoading:", authLoading);
  console.log("AdminRoute - isAdmin:", authUser?.isAdmin);
  
  if (authLoading) return <Spinner />;
  
  if (!authUser) {
    console.log("AdminRoute - No auth user, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  if (!authUser.isAdmin) {
    console.log("AdminRoute - User is not admin, redirecting to home");
    return <Navigate to="/" replace />;
  }
  
  console.log("AdminRoute - Admin user confirmed, rendering children");
  return children;
};

export default AdminRoute;
