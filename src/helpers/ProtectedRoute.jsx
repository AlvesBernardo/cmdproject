import { Navigate, Outlet } from "react-router-dom";
import TokenManager from "../helpers/TokenManager";

const ProtectedRoute = () => {
  const isAuthenticated = !TokenManager.isTokenExpired();
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
