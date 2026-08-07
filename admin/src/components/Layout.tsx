import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Layout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between border-b bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-lg font-semibold text-gray-800">
            Company Admin
          </Link>
          <nav className="flex gap-4 text-sm font-medium text-gray-600">
            <Link to="/" className="hover:text-gray-900">
              Dashboard
            </Link>
            <Link to="/members" className="hover:text-gray-900">
              Members
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{admin?.email}</span>
          <button
            onClick={handleLogout}
            className="rounded-md bg-gray-100 px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-200"
          >
            Log out
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
