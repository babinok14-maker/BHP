import { createContext, ReactNode, useEffect, useState } from "react";
import * as authApi from "../api/auth";
import { Admin } from "../types";

interface AuthContextValue {
  admin: Admin | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setIsLoading(false);
      return;
    }
    authApi
      .fetchMe()
      .then(setAdmin)
      .catch(() => localStorage.removeItem("admin_token"))
      .finally(() => setIsLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const { token, admin: loggedInAdmin } = await authApi.login(email, password);
    localStorage.setItem("admin_token", token);
    setAdmin(loggedInAdmin);
  }

  async function logout() {
    await authApi.logout().catch(() => {});
    localStorage.removeItem("admin_token");
    setAdmin(null);
  }

  return (
    <AuthContext.Provider value={{ admin, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
