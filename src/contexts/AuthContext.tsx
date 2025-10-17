// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "@/services/authApi";

type User = {
  id: number;
  firstname?: string;
  lastname?: string;
  email: string;
  username?: string;
  mobile?: string;
};

type Ctx = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (p: {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
  }) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
};
const AuthContext = createContext<Ctx | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("auth_user");
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const isAuthenticated = !!user || !!localStorage.getItem("auth_token");

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.login(email, password);

      // success shape is backend-specific; accept common variants
      const ok =
        res?.status === "Success" ||
        res?.success === true ||
        !!(res?.access_token || res?.token || res?.data?.access_token);

      if (ok) {
        const u = res?.userDetails || res?.user || res?.data?.user || null;
        if (u) {
          setUser(u);
          localStorage.setItem("auth_user", JSON.stringify(u));
        }
        return true;
      }

      setError(res?.message || "Login failed");
      return false;
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (p: Parameters<typeof authApi.register>[0]) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.register(p);
      const ok = res?.status === "Success" || res?.success === true;
      if (!ok) setError(res?.message || "Registration failed");
      return !!ok;
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Registration failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, error, isAuthenticated, login, register, logout, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};
