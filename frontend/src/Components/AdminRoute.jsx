import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuthContext } from "../hooks/useAuthContext";
import Spinner from "./Spinner";

const AdminRoute = ({ children }) => {
  const { authUser, authLoading } = useAuthContext();
  
  // Debug logs removed for cleaner console
  
  if (authLoading) return <Spinner />;
  
  if (!authUser) {
    // No auth user, redirecting to login
    return <Navigate to="/login" replace />;
  }
  
  if (!authUser.isAdmin) {
    // User is not admin, redirecting to home
    return <Navigate to="/" replace />;
  }
  
  // Admin user confirmed, rendering children
  return children;
};

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminRoute;
