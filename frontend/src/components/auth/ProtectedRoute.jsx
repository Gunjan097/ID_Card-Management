import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { authData } = useAuth();

  if (!authData) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && authData.role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
