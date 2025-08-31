import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import Spinner from "./Spinner";

const ProtectedRoute = ({ children }) => {
  const { authUser, authLoading } = useAuthContext();
  
  if (authLoading) return <Spinner />;
  
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }
  
  // If admin user tries to access regular routes, redirect to admin dashboard
  if (authUser.isAdmin) {
    console.log("ProtectedRoute - Admin user accessing regular route, redirecting to /admin");
    return <Navigate to="/admin" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
