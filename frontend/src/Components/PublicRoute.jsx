import { Navigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import Spinner from "./Spinner";

const PublicRoute = ({ children }) => {
  const { authUser, authLoading } = useAuthContext();
  if (authLoading) return <Spinner />;
  return !authUser ? children : <Navigate to="/" replace />;
};

export default PublicRoute;
