// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import authApi from "../services/authApi";
import { setAuthToken } from "../services/http";

type User = {
  id?: number;
  firstname?: string;
  lastname?: string;
  email?: string;
  username?: string;
  mobile?: string;
  [k: string]: any;
};

type Ctx = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (p: any) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<Ctx | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // hydrate user from localStorage on start
  useEffect(() => {
    try {
      const rawUser = localStorage.getItem("auth_user");
      const rawToken = localStorage.getItem("auth_token");
      if (rawToken) {
        setAuthToken(rawToken);
      }
      if (rawUser) {
        setUser(JSON.parse(rawUser));
      }
    } catch (err) {
      // ignore
    }
  }, []);

  const isAuthenticated = !!user || !!localStorage.getItem("auth_token");

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log("[AuthContext] Attempting login with:", { email, password: "***" });
      const res = await authApi.login(email, password);
      console.log("[AuthContext] Login response:", res);

      // Extract token in common places
      const accessToken =
        res?.access_token ||
        res?.token ||
        res?.data?.access_token ||
        res?.tokenDetails?.access_token ||
        res?.tokenDetails?.token ||
        (typeof res === "string" ? null : null);
      
      console.log("[AuthContext] Extracted access token:", accessToken ? "***" : "none");

      if (!accessToken) {
        // If response included token in a nested field use that; otherwise fail
        setError(res?.message || JSON.stringify(res) || "Login did not return token");
        setLoading(false);
        return false;
      }

      // Save token and configure http client
      setAuthToken(accessToken);

      // Extract user object if present
      const u =
        res?.userDetails || res?.user || res?.data?.user || res?.user_details || null;

      if (u) {
        setUser(u);
        try {
          localStorage.setItem("auth_user", JSON.stringify(u));
        } catch {}
      }

      // Persist token
      try {
        localStorage.setItem("auth_token", accessToken);
      } catch {}

      setLoading(false);
      return true;
    } catch (e: any) {
      const msg = e?.message ?? "Login failed";
      setError(msg);
      setLoading(false);
      return false;
    }
  };

  const register = async (payload: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.register(payload);
      const ok = res?.status === "Success" || res?.success === true || res?.message === "Success";
      if (!ok) {
        setError(res?.message || "Registration failed");
      }
      setLoading(false);
      return !!ok;
    } catch (e: any) {
      setError(e?.message || "Registration failed");
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setAuthToken(null);
      try {
        localStorage.removeItem("auth_user");
        localStorage.removeItem("auth_token");
      } catch {}
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{ user, isLoading: isLoading, error, isAuthenticated, login, register, logout, clearError }}
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
