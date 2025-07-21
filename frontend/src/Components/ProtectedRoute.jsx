import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import Spinner from "./Spinner";

const ProtectedRoute = ({ children }) => {
  const { authUser, authLoading } = useAuthContext();
  if (authLoading) return <Spinner />;
  return authUser ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
