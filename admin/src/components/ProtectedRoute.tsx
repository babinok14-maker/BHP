import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Wraps admin-only routes. Visitors without a valid session are redirected
// to /login — the dashboard itself is never rendered for them.
export default function ProtectedRoute() {
  const { admin, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center text-gray-500">Loading…</div>;
  }

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
