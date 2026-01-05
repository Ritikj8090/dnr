import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { RootState } from "@/store";

interface ProtectedRouteProps {
  roles: string[];
}

const ProtectedRoute = ({ roles }: ProtectedRouteProps) => {
  const location = useLocation();
  const { isLoading, user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  if (isLoading) {
    // ⏳ If loading, you might want to show a spinner or loading state
    console.log("⏳ Loading authentication state...");
    return <div>Loading...</div>; // Replace with your loading component
  }

  // 🔒 Not logged in? Redirect to login
  if (!isAuthenticated) {
    console.log("🔐 User is not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ⛔ Logged in but role not allowed
  if (roles.length > 0 && (!user.role || !roles.includes(user.role))) {
    return <Navigate to="/" replace />;
  }

  // ✅ Authorized
  return <Outlet />;
};

export default ProtectedRoute;
