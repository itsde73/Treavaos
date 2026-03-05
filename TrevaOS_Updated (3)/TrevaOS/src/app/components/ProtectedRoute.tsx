import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

/** Redirects unauthenticated users to /login. */
export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}

/** Redirects unauthenticated users to /login and non-super_admin users to /. */
export function AdminRoute() {
  const { isAuthenticated, authUser } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (authUser?.type !== "super_admin") {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
